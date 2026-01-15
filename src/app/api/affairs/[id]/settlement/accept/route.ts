import { NextRequest, NextResponse } from "next/server";
import { prisma, prismaWithTimeout } from '@/lib/prisma';
import { getAuthUserFromHeaders } from '@/lib/auth/middleware';
import { requireCSRF } from '@/lib/auth/csrf';

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

        const { id } = await params;

        const affair = await prismaWithTimeout(async (client) => {
            return client.affair.findUnique({
                where: { id },
                select: {
                    id: true,
                    creatorId: true,
                    involvedUserId: true,
                    settlementProposalStatus: true,
                    settlementAcceptedBy: true,
                    aiAnalysis: true,
                } as any
            });
        }, 30000) as {
            id: string;
            creatorId: string;
            involvedUserId: string | null;
            settlementProposalStatus: string | null;
            settlementAcceptedBy: string | null;
            aiAnalysis: string | null;
        } | null;

        if (!affair) {
            return NextResponse.json(
                { error: 'Sprawa nie została znaleziona' },
                { status: 404 }
            );
        }

        // Walidacja uprawnień: sprawdź czy użytkownik jest uczestnikiem sprawy
        // To jest główna walidacja - uczestnictwo jest wymagane do akceptacji rozliczenia
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

        let acceptedBy: string[] = [];
        const acceptedByStr = affair.settlementAcceptedBy as unknown as string | null;
        if (acceptedByStr) {
            try {
                acceptedBy = JSON.parse(acceptedByStr);
            } catch {
                acceptedBy = [];
            }
        }

        if (acceptedBy.includes(authUser.userId)) {
            return NextResponse.json(
                { error: 'Już zaakceptowałeś to porozumienie' },
                { status: 400 }
            );
        }

        acceptedBy.push(authUser.userId);

        const otherUserId = affair.creatorId === authUser.userId 
            ? affair.involvedUserId 
            : affair.creatorId;

        await prismaWithTimeout(async (client) => {
            return client.$transaction(async (tx) => {
            await tx.affairParticipant.update({
                where: { id: participant.id },
                data: {
                    settlementAcceptedAt: new Date()
                } as any
            });

            const otherParticipant = otherUserId ? await tx.affairParticipant.findUnique({
                where: {
                    userId_affairId: {
                        userId: otherUserId,
                        affairId: id
                    }
                },
                select: {
                    id: true,
                    settlementAcceptedAt: true
                } as any
            }) : null;

            const otherHasAccepted = otherParticipant && (otherParticipant as any).settlementAcceptedAt !== null;

            if (otherHasAccepted) {
                await tx.affair.update({
                    where: { id },
                    data: {
                        settlementProposalStatus: 'accepted-all',
                        settlementAcceptedBy: JSON.stringify(acceptedBy)
                    } as any
                });

                await tx.affairParticipant.update({
                    where: { id: participant.id },
                    data: { status: 'DONE' }
                });

                if (otherParticipant) {
                    await tx.affairParticipant.update({
                        where: { id: otherParticipant.id },
                        data: { status: 'DONE' }
                    });
                }
            } else {
                const newStatus = affair.creatorId === authUser.userId 
                    ? 'awaiting-involved' 
                    : 'awaiting-creator';

                await tx.affair.update({
                    where: { id },
                    data: {
                        settlementProposalStatus: newStatus,
                        settlementAcceptedBy: JSON.stringify(acceptedBy)
                    } as any
                });

                await tx.affairParticipant.update({
                    where: { id: participant.id },
                    data: { status: 'WAITING' }
                });
            }

            const aiAnalysisStr = affair.aiAnalysis as unknown as string | null;
            if (aiAnalysisStr) {
                try {
                    const analysis = JSON.parse(aiAnalysisStr);
                    if (analysis.propozycja_porozumienia) {
                        if (otherHasAccepted) {
                            analysis.propozycja_porozumienia.status = 'accepted-all';
                        } else {
                            analysis.propozycja_porozumienia.status = affair.creatorId === authUser.userId 
                                ? 'accepted-you' 
                                : 'accepted-you';
                        }
                        await tx.affair.update({
                            where: { id },
                            data: {
                                aiAnalysis: JSON.stringify(analysis)
                            }
                        });
                    }
                } catch (error) {
                    console.error('Error updating aiAnalysis status:', error);
                }
            }
            });
        }, 30000);

        return NextResponse.json(
            { message: 'Porozumienie zostało zaakceptowane' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error accepting settlement:', error);
        return NextResponse.json(
            { error: 'Wystąpił błąd podczas akceptacji porozumienia' },
            { status: 500 }
        );
    }
}
