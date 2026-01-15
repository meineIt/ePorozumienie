import { NextRequest, NextResponse } from "next/server";
import { prisma, prismaWithTimeout } from '@/lib/prisma';
import { getAuthUserFromHeaders } from '@/lib/auth/middleware';
import { requireCSRF } from '@/lib/auth/csrf';
import { analyzeAffairPositions, bothPartiesHavePositions } from '@/lib/ai/analyzer';
import { sanitizeText } from '@/lib/utils/sanitize';

interface ModifySettlementBody {
    feedback: string;
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Autentykacja jest obsługiwana przez globalny middleware
        const authUser = getAuthUserFromHeaders(request)

        // CSRF protection
        const csrfError = requireCSRF(request)
        if (csrfError) {
            return csrfError
        }

        const contentLength = request.headers.get('content-length')
        if (contentLength && parseInt(contentLength) > 10 * 1024) {
            return NextResponse.json(
                { error: 'Request zbyt duży' },
                { status: 413 }
            )
        }

        const { id } = await params;
        const body = await request.json() as ModifySettlementBody;
        const { feedback } = body;

        // Walidacja typu
        if (typeof feedback !== 'string') {
            return NextResponse.json(
                { error: 'Propozycja zmian musi być ciągiem znaków' },
                { status: 400 }
            );
        }

        if (!feedback || feedback.trim().length === 0) {
            return NextResponse.json(
                { error: 'Propozycja zmian nie może być pusta' },
                { status: 400 }
            );
        }

        if (feedback.length > 5000) {
            return NextResponse.json(
                { error: 'Propozycja zmian nie może być dłuższa niż 5000 znaków' },
                { status: 400 }
            );
        }

        const affair = await prismaWithTimeout(async (client) => {
            return client.affair.findUnique({
                where: { id },
                select: {
                    id: true,
                    creatorId: true,
                    involvedUserId: true,
                    settlementProposalStatus: true,
                    settlementAcceptedBy: true,
                    settlementModificationRequests: true,
                } as any
            });
        }, 30000);

        if (!affair) {
            return NextResponse.json(
                { error: 'Sprawa nie została znaleziona' },
                { status: 404 }
            );
        }

        // Walidacja uprawnień: sprawdź czy użytkownik jest uczestnikiem sprawy
        // To jest główna walidacja - uczestnictwo jest wymagane do modyfikacji rozliczenia
        const participant = await prismaWithTimeout(async (client) => {
            return client.affairParticipant.findUnique({
                where: {
                    userId_affairId: {
                        userId: authUser.userId,
                        affairId: id
                    }
                }
            });
        }, 30000);

        if (!participant) {
            return NextResponse.json(
                { error: 'Brak uprawnień: nie jesteś uczestnikiem tej sprawy' },
                { status: 403 }
            );
        }

        // Określ drugą stronę
        const otherUserId = affair.creatorId === authUser.userId 
            ? affair.involvedUserId 
            : affair.creatorId;

        let modificationRequests: Array<{ userId: string; feedback: string; timestamp: string }> = [];
        if (affair.settlementModificationRequests) {
            try {
                modificationRequests = JSON.parse(affair.settlementModificationRequests);
            } catch {
                modificationRequests = [];
            }
        }

        // Sanityzacja feedback przed zapisem
        const sanitizedFeedback = sanitizeText(feedback.trim())

        const newModificationRequest = {
            userId: authUser.userId,
            feedback: sanitizedFeedback,
            timestamp: new Date().toISOString()
        };
        modificationRequests.push(newModificationRequest);

        const otherParticipant = otherUserId ? await prismaWithTimeout(async (client) => {
            return client.affairParticipant.findUnique({
                where: {
                    userId_affairId: {
                        userId: otherUserId,
                        affairId: id
                    }
                }
            });
        }, 30000) : null;

        const otherHasAccepted = otherParticipant?.settlementAcceptedAt !== null;
        const otherHasModificationRequest = otherParticipant?.settlementModificationRequestedAt !== null;

        const shouldRegenerate = otherHasAccepted || otherHasModificationRequest;

        await prismaWithTimeout(async (client) => {
            return client.$transaction(async (tx) => {
            await tx.affairParticipant.update({
                where: { id: participant.id },
                data: {
                    settlementModificationRequestedAt: new Date()
                } as any
            });

            if (shouldRegenerate) {
                await tx.affair.update({
                    where: { id },
                    data: {
                        aiAnalysis: null,
                        settlementAcceptedBy: null,
                        settlementModificationRequests: null,
                        settlementProposalStatus: 'awaiting-both'
                    } as any
                });

                if (otherParticipant) {
                    await tx.affairParticipant.update({
                        where: { id: otherParticipant.id },
                        data: {
                            settlementAcceptedAt: null,
                            settlementModificationRequestedAt: null
                        } as any
                    });
                }
                await tx.affairParticipant.update({
                    where: { id: participant.id },
                    data: {
                        settlementAcceptedAt: null,
                        settlementModificationRequestedAt: new Date(),
                        status: 'WAITING'
                    } as any
                });
            } else {
                // Tylko zapisz propozycję zmian
                await tx.affair.update({
                    where: { id },
                    data: {
                        settlementProposalStatus: 'modification-requested',
                        settlementModificationRequests: JSON.stringify(modificationRequests)
                    } as any
                });

                await tx.affairParticipant.update({
                    where: { id: participant.id },
                    data: {
                        settlementModificationRequestedAt: new Date(),
                        status: 'WAITING'
                    } as any
                });
            }
            });
        }, 30000);

        if (shouldRegenerate) {
            (async () => {
                try {
                    const allModificationRequests = modificationRequests.map(mr => mr.feedback);

                    const affairWithParticipants = await prismaWithTimeout(async (client) => {
                        return client.affair.findUnique({
                            where: { id },
                            include: {
                                participants: {
                                    select: {
                                        userId: true,
                                        description: true,
                                        files: true,
                                    },
                                },
                            },
                        });
                    }, 30000);

                    if (affairWithParticipants && bothPartiesHavePositions(affairWithParticipants)) {
                        const analysis = await analyzeAffairPositions(id, allModificationRequests);
                        
                        await prismaWithTimeout(async (client) => {
                            return client.affair.update({
                                where: { id },
                                data: {
                                    aiAnalysis: JSON.stringify(analysis),
                                    aiAnalysisGeneratedAt: new Date(),
                                    settlementProposalStatus: 'awaiting-both',
                                    settlementModificationRequests: null // Wyczyść po regeneracji
                                } as any
                            });
                        }, 30000);

                        await prismaWithTimeout(async (client) => {
                            return client.affairParticipant.updateMany({
                                where: { affairId: id },
                                data: {
                                    settlementModificationRequestedAt: null,
                                    status: 'REACTION_NEEDED'
                                } as any
                            });
                        }, 30000);
                    }
                } catch (error) {
                    console.error('Error regenerating settlement:', error);
                }
            })();
        }

        return NextResponse.json(
            { 
                message: shouldRegenerate 
                    ? 'Propozycja zmian została zapisana. Nowe porozumienie jest generowane.' 
                    : 'Propozycja zmian została zapisana. Oczekiwanie na reakcję drugiej strony.'
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error modifying settlement:', error);
        return NextResponse.json(
            { error: 'Wystąpił błąd podczas zapisywania propozycji zmian' },
            { status: 500 }
        );
    }
}
