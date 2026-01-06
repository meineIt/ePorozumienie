import { NextRequest, NextResponse } from 'next/server';
import { sendDiscountEmail, sendDiscountConfirmationEmail } from '@/lib/utils/email';

export async function POST(request: NextRequest) {
  try {
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Nieprawidłowy format email' },
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

