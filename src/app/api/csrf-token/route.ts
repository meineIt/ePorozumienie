import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserFromHeaders } from '@/lib/auth/middleware';
import { getTokenFromRequest } from '@/lib/auth/jwt';
import { generateCSRFToken } from '@/lib/auth/csrf';

export async function GET(request: NextRequest) {
  try {
    // Autentykacja jest obsługiwana przez globalny middleware
    getAuthUserFromHeaders(request);

    // Pobierz JWT token z requestu
    const sessionToken = getTokenFromRequest(request);
    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Session token not found' },
        { status: 401 }
      );
    }

    // Generuj CSRF token na podstawie JWT tokenu
    const csrfToken = generateCSRFToken(sessionToken);

    return NextResponse.json(
      { csrfToken },
      { status: 200 }
    );
  } catch (error) {
    console.error('CSRF token error:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas generowania CSRF tokenu' },
      { status: 500 }
    );
  }
}
