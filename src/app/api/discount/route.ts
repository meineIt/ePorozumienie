import { NextRequest } from 'next/server';
import { sendDiscountEmail, sendDiscountConfirmationEmail } from '@/lib/utils/email';
import { getRateLimit } from '@/lib/auth/rateLimitConfig';
import { withErrorHandling, ok, internalError } from '@/lib/api/response';
import { validateBody, discountSchema } from '@/lib/api/validators';
import { withRateLimit, withContentLength } from '@/lib/api/proxy';

export async function POST(request: NextRequest) {
  return withErrorHandling(async () => {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const rateLimitConfig = getRateLimit('discount');
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

    // Content length check
    const contentLengthResult = await withContentLength(10 * 1024)(request);
    if (contentLengthResult) {
      return contentLengthResult;
    }

    // Walidacja body
    const bodyResult = await validateBody(discountSchema, request);
    if (bodyResult instanceof Response) {
      return bodyResult;
    }
    const { name, email } = bodyResult;

    // Wyślij email do administratora
    const adminEmailResult = await sendDiscountEmail({
      name,
      email,
    });

    if (!adminEmailResult.success) {
      console.error('Failed to send admin email:', adminEmailResult.error);
      return internalError('Wystąpił błąd podczas wysyłania wiadomości');
    }

    // Wyślij email z kodem rabatowym do użytkownika
    const confirmationResult = await sendDiscountConfirmationEmail(email, name);
    if (!confirmationResult.success) {
      console.warn('Failed to send confirmation email:', confirmationResult.error);
      // Nie przerywamy - główny email został wysłany
    }

    return ok({
      success: true,
      message: 'Zapisano pomyślnie! Sprawdź swoją skrzynkę email.',
    });
  });
}
