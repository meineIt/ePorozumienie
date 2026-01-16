import { NextResponse } from 'next/server';

/**
 * Wspólne helpery dla odpowiedzi API
 * Zapewniają spójność w formatowaniu odpowiedzi
 */

export class ApiError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Sukces response
 */
export function ok<T>(data: T, status: number = 200): NextResponse {
  return NextResponse.json(data, { status });
}

/**
 * Bad Request (400)
 */
export function badRequest(message: string): NextResponse {
  return NextResponse.json(
    { error: message },
    { status: 400 }
  );
}

/**
 * Unauthorized (401)
 */
export function unauthorized(message: string = 'Wymagana autentykacja'): NextResponse {
  return NextResponse.json(
    { error: message },
    { status: 401 }
  );
}

/**
 * Forbidden (403)
 */
export function forbidden(message: string = 'Brak uprawnień'): NextResponse {
  return NextResponse.json(
    { error: message },
    { status: 403 }
  );
}

/**
 * Not Found (404)
 */
export function notFound(message: string = 'Nie znaleziono'): NextResponse {
  return NextResponse.json(
    { error: message },
    { status: 404 }
  );
}

/**
 * Payload Too Large (413)
 */
export function tooLarge(message: string = 'Request zbyt duży'): NextResponse {
  return NextResponse.json(
    { error: message },
    { status: 413 }
  );
}

/**
 * Too Many Requests (429)
 */
export function tooManyRequests(message: string = 'Zbyt wiele prób. Spróbuj ponownie za chwilę.'): NextResponse {
  return NextResponse.json(
    { error: message },
    { status: 429 }
  );
}

/**
 * Internal Server Error (500)
 */
export function internalError(message: string = 'Wystąpił błąd podczas przetwarzania żądania'): NextResponse {
  return NextResponse.json(
    { error: message },
    { status: 500 }
  );
}

/**
 * Wrapper do obsługi błędów w route handlers
 * Automatycznie przechwytuje błędy i zwraca odpowiednie odpowiedzi
 */
export async function withErrorHandling<T>(
  handler: () => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    return await handler();
  } catch (error) {
    // Jeśli to już NextResponse (np. z middleware), zwróć go
    if (error instanceof NextResponse) {
      return error;
    }
    
    // Obsługa ApiError
    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }
    
    // Obsługa standardowych błędów
    if (error instanceof Error) {
      // Sprawdź czy to błąd autentykacji
      if (error.message === 'Unauthorized - user data not found in headers') {
        return unauthorized();
      }
      
      console.error('Route error:', error);
      return internalError();
    }
    
    // Nieznany błąd
    console.error('Unknown error:', error);
    return internalError();
  }
}
