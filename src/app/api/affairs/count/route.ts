import { NextRequest } from 'next/server';
import { getAuthUserFromHeaders } from '@/lib/auth/middleware';
import { withErrorHandling, ok } from '@/lib/api/response';
import { countUserCreatedAffairs } from '@/lib/services/affairCrudServices';

export async function GET(request: NextRequest) {
    return withErrorHandling(async () => {
        const authUser = getAuthUserFromHeaders(request);

        const count = await countUserCreatedAffairs(authUser.userId);
        
        return ok({ count })
    });
}