import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from './jwt';

/**
 * Middleware do weryfikacji autentykacji użytkownika
 * Zwraca null jeśli użytkownik jest autentykowany, lub NextResponse z błędem jeśli nie
 */
export function requireAuth(request: NextRequest): NextResponse | null {
  const user = getAuthenticatedUser(request);

  if (!user) {
    return NextResponse.json(
      { error: 'Wymagana autentykacja' },
      { status: 401 }
    );
  }

  return null;
}

/**
 * Middleware do weryfikacji autentykacji i zwrócenia użytkownika
 * Rzuca błąd jeśli użytkownik nie jest autentykowany
 */
export function getAuthUser(request: NextRequest): { userId: string; email: string } {
  const user = getAuthenticatedUser(request);

  if (!user) {
    throw new Error('Unauthorized');
  }

  return user;
}


