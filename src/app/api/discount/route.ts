import { NextRequest, NextResponse } from 'next/server';
import { sendDiscountEmail, sendDiscountConfirmationEmail } from '@/lib/utils/email';
import { rateLimit } from '@/lib/auth/rateLimit';
import { isValidEmail } from '@/lib/api/validation';

// Rate limiting: 3 zapytania na 60 minut
const discountRateLimit = rateLimit({
  interval: 60 * 60 * 1000, // 60 minut
  uniqueTokenPerInterval: 500,
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    try {
      await discountRateLimit.check(3, ip, request)
    } catch {
      return NextResponse.json(
        { error: 'Zbyt wiele prób. Spróbuj ponownie za chwilę.' },
        { status: 429 }
      )
    }

    // Walidacja rozmiaru requestu (max 10KB)
    const contentLength = request.headers.get('content-length')
    if (contentLength && parseInt(contentLength) > 10 * 1024) {
      return NextResponse.json(
        { error: 'Request zbyt duży' },
        { status: 413 }
      )
    }

    const body = await request.json();
    const { name, email } = body;

    // Walidacja
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Imię i email są wymagane' },
        { status: 400 }
      );
    }

    // Walidacja email
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Nieprawidłowy format email' },
        { status: 400 }
      );
    }

    // Walidacja długości pól
    if (name.length > 200 || email.length > 200) {
      return NextResponse.json(
        { error: 'Pola są zbyt długie' },
        { status: 400 }
      );
    }

    // Wyślij email do administratora
    const adminEmailResult = await sendDiscountEmail({
      name,
      email,
    });

    if (!adminEmailResult.success) {
      console.error('Failed to send admin email:', adminEmailResult.error);
      return NextResponse.json(
        { error: 'Wystąpił błąd podczas wysyłania wiadomości' },
        { status: 500 }
      );
    }

    // Wyślij email z kodem rabatowym do użytkownika
    const confirmationResult = await sendDiscountConfirmationEmail(email, name);
    if (!confirmationResult.success) {
      console.warn('Failed to send confirmation email:', confirmationResult.error);
      // Nie przerywamy - główny email został wysłany
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Zapisano pomyślnie! Sprawdź swoją skrzynkę email.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Discount form error:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas przetwarzania żądania' },
      { status: 500 }
    );
  }
}

