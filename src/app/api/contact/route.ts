import { NextRequest, NextResponse } from 'next/server';
import { sendContactEmail, sendContactConfirmationEmail } from '@/lib/utils/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message, subject } = body;

    // Walidacja
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Imię, email i wiadomość są wymagane' },
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
    const adminEmailResult = await sendContactEmail({
      name,
      email,
      message,
      subject,
    });

    if (!adminEmailResult.success) {
      console.error('Failed to send admin email:', adminEmailResult.error);
      return NextResponse.json(
        { error: 'Wystąpił błąd podczas wysyłania wiadomości' },
        { status: 500 }
      );
    }

    // Wyślij email potwierdzający do użytkownika
    const confirmationResult = await sendContactConfirmationEmail(email, name);
    if (!confirmationResult.success) {
      console.warn('Failed to send confirmation email:', confirmationResult.error);
      // Nie przerywamy - główny email został wysłany
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Wiadomość została wysłana pomyślnie',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas przetwarzania żądania' },
      { status: 500 }
    );
  }
}

