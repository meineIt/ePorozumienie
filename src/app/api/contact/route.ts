import { NextRequest, NextResponse } from 'next/server';
import { sendContactEmail, sendContactConfirmationEmail } from '@/lib/utils/email';
import { rateLimit } from '@/lib/auth/rateLimit';
import { isValidEmail } from '@/lib/api/validation';

// Rate limiting: 5 wiadomości na 15 minut
const contactRateLimit = rateLimit({
  interval: 15 * 60 * 1000, // 15 minut
  uniqueTokenPerInterval: 500,
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    try {
      await contactRateLimit.check(5, ip)
    } catch {
      return NextResponse.json(
        { error: 'Zbyt wiele prób wysłania wiadomości. Spróbuj ponownie za chwilę.' },
        { status: 429 }
      )
    }

    // Walidacja rozmiaru requestu (max 50KB)
    const contentLength = request.headers.get('content-length')
    if (contentLength && parseInt(contentLength) > 50 * 1024) {
      return NextResponse.json(
        { error: 'Request zbyt duży' },
        { status: 413 }
      )
    }

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
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Nieprawidłowy format email' },
        { status: 400 }
      );
    }

    // Walidacja długości pól
    if (name.length > 200 || email.length > 200 || (subject && subject.length > 200)) {
      return NextResponse.json(
        { error: 'Pola są zbyt długie' },
        { status: 400 }
      );
    }

    if (message.length > 5000) {
      return NextResponse.json(
        { error: 'Wiadomość jest zbyt długa (max 5000 znaków)' },
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

