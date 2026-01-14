import { NextRequest, NextResponse } from 'next/server';
import { prismaWithTimeout } from '@/lib/prisma';
import { getAuthUserFromHeaders } from '@/lib/auth/middleware';
import { requireCSRF } from '@/lib/auth/csrf';
import { rateLimit } from '@/lib/auth/rateLimit';
import { sanitizeName } from '@/lib/utils/sanitize';

// Rate limiting: 10 aktualizacji na 15 minut na użytkownika
const profileRateLimit = rateLimit({
  interval: 15 * 60 * 1000, // 15 minut
  uniqueTokenPerInterval: 500,
});

// Rate limiting dla GET: 30 zapytań na 15 minut na użytkownika
const profileGetRateLimit = rateLimit({
  interval: 15 * 60 * 1000, // 15 minut
  uniqueTokenPerInterval: 500,
});

/**
 * GET - Pobiera dane użytkownika (weryfikacja autentykacji)
 */
export async function GET(request: NextRequest) {
  try {
    // Autentykacja jest obsługiwana przez globalny middleware
    const authUser = getAuthUserFromHeaders(request);

    // Rate limiting
    try {
      await profileGetRateLimit.check(30, authUser.userId, request);
    } catch {
      return NextResponse.json(
        { error: 'Zbyt wiele prób. Spróbuj ponownie za chwilę.' },
        { status: 429 }
      );
    }

    // Pobierz dane użytkownika z bazy
    const user = await prismaWithTimeout(async (client) => {
      return client.user.findUnique({
        where: { id: authUser.userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    }, 30000);

    if (!user) {
      return NextResponse.json(
        { error: 'Użytkownik nie został znaleziony' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Profile get error:', error);
    // Jeśli błąd autentykacji (Unauthorized), zwróć 401
    if (error instanceof Error && error.message === 'Unauthorized - user data not found in headers') {
      return NextResponse.json(
        { error: 'Wymagana autentykacja' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas pobierania profilu' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Autentykacja jest obsługiwana przez globalny middleware
    const authUser = getAuthUserFromHeaders(request);

    // Rate limiting
    try {
      await profileRateLimit.check(10, authUser.userId, request);
    } catch {
      return NextResponse.json(
        { error: 'Zbyt wiele prób aktualizacji profilu. Spróbuj ponownie za chwilę.' },
        { status: 429 }
      );
    }

    // CSRF protection
    const csrfError = requireCSRF(request)
    if (csrfError) {
      return csrfError
    }

    // Walidacja rozmiaru requestu (max 10KB)
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 10 * 1024) {
      return NextResponse.json(
        { error: 'Request zbyt duży' },
        { status: 413 }
      );
    }

    const body = await request.json();
    const { firstName, lastName, userId } = body;

    // Walidacja uprawnień: odrzuć userId jeśli został podany
    // Endpoint zawsze aktualizuje profil zalogowanego użytkownika
    if (userId !== undefined && userId !== null) {
      return NextResponse.json(
        { error: 'Nie można modyfikować userId. Endpoint aktualizuje tylko profil zalogowanego użytkownika.' },
        { status: 400 }
      );
    }

    // Walidacja
    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: 'Imię i nazwisko są wymagane' },
        { status: 400 }
      );
    }

    // Walidacja długości
    if (firstName.trim().length === 0 || lastName.trim().length === 0) {
      return NextResponse.json(
        { error: 'Imię i nazwisko nie mogą być puste' },
        { status: 400 }
      );
    }

    if (firstName.length > 100 || lastName.length > 100) {
      return NextResponse.json(
        { error: 'Imię i nazwisko nie mogą być dłuższe niż 100 znaków' },
        { status: 400 }
      );
    }

    // Sanityzacja danych przed zapisem
    const sanitizedFirstName = sanitizeName(firstName.trim())
    const sanitizedLastName = sanitizeName(lastName.trim())

    // Aktualizuj profil użytkownika
    const updatedUser = await prismaWithTimeout(async (client) => {
        return client.user.update({
            where: { id: authUser.userId },
            data: {
                firstName: sanitizedFirstName,
                lastName: sanitizedLastName,
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }, 30000);

    return NextResponse.json(
      {
        message: 'Profil został zaktualizowany',
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas aktualizacji profilu' },
      { status: 500 }
    );
  }
}
