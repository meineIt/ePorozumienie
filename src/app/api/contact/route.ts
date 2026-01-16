import { NextRequest } from 'next/server';
import { sendContactEmail, sendContactConfirmationEmail } from '@/lib/utils/email';
import { getRateLimit } from '@/lib/auth/rateLimitConfig';
import { withErrorHandling, ok, internalError } from '@/lib/api/response';
import { validateBody, contactSchema } from '@/lib/api/validators';
import { withRateLimit, withContentLength } from '@/lib/api/proxy';
import { sanitizeString, sanitizeText } from '@/lib/utils/sanitize';

export async function POST(request: NextRequest) {
  return withErrorHandling(async () => {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const rateLimitConfig = getRateLimit('contact');
    const rateLimitMiddleware = withRateLimit(
      rateLimitConfig.limit,
      rateLimitConfig.interval,
      ip,
      { headers: request.headers, url: request.url }
    );
    
    const rateLimitResult = await rateLimitMiddleware(request);
    if (rateLimitResult) {
      return rateLimitResult;
    }

    const contentLengthResult = await withContentLength(50 * 1024)(request);
    if (contentLengthResult) {
      return contentLengthResult;
    }

    const bodyResult = await validateBody(contactSchema, request);
    if (bodyResult instanceof Response) {
      return bodyResult;
    }
    const { name, email, message, subject } = bodyResult;

    // Sanityzacja danych przed wysłaniem emaila
    const sanitizedName = sanitizeString(name);
    const sanitizedMessage = sanitizeText(message);
    const sanitizedSubject = subject ? sanitizeString(subject) : undefined;

    // Wyślij email do administratora
    const adminEmailResult = await sendContactEmail({
      name: sanitizedName,
      email,
      message: sanitizedMessage,
      subject: sanitizedSubject,
    });

    if (!adminEmailResult.success) {
      console.error('Failed to send admin email:', adminEmailResult.error);
      return internalError('Wystąpił błąd podczas wysyłania wiadomości');
    }

    // Wyślij email potwierdzający do użytkownika
    const confirmationResult = await sendContactConfirmationEmail(email, sanitizedName);
    if (!confirmationResult.success) {
      console.warn('Failed to send confirmation email:', confirmationResult.error);
      // Nie przerywamy - główny email został wysłany
    }

    return ok({
      success: true,
      message: 'Wiadomość została wysłana pomyślnie',
    });
  });
}
