import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth/middleware';

export async function PATCH(request: NextRequest) {
  try {
    // Autentykacja
    let authUser;
    try {
      authUser = getAuthUser(request);
    } catch {
      return NextResponse.json(
        { error: 'Wymagana autentykacja' },
        { status: 401 }
      );
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
    const { firstName, lastName } = body;

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

    // Aktualizuj profil użytkownika
    const updatedUser = await prisma.user.update({
      where: { id: authUser.userId },
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
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
