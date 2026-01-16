import { logUnauthorizedAccess } from '@/lib/utils/securityLogger';
import { NextRequest } from 'next/server';

/**
 * Pobiera dane użytkownika z headers requestu
 * Headers są ustawiane przez globalny middleware Next.js po pomyślnej autentykacji
 * 
 * @param request - NextRequest z headers zawierającymi dane użytkownika
 * @returns Dane użytkownika (userId, email)
 * @throws Error jeśli dane użytkownika nie są dostępne w headers
 */
export function getAuthUserFromHeaders(request: NextRequest): { userId: string; email: string } {
    const userId = request.headers.get('x-user-id');
    const email = request.headers.get('x-user-email');
  
    if (!userId || !email) {
      logUnauthorizedAccess('Unauthorized access attempt - getAuthUserFromHeaders (missing headers)', {
        headers: request.headers,
        url: request.url,
      }, {
        method: request.method,
      });
      throw new Error('Unauthorized - user data not found in headers');
    }
  
    return { userId, email };
  }