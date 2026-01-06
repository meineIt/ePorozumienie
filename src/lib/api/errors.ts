import { NextResponse } from 'next/server';

/**
 * Wspólne odpowiedzi błędów API
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
 * Tworzy odpowiedź błędu API
 */
export function createErrorResponse(error: string | Error, statusCode: number = 500): NextResponse {
  const message = error instanceof Error ? error.message : error;
  return NextResponse.json(
    { error: message },
    { status: statusCode }
  );
}

/**
 * Wspólne odpowiedzi sukcesu API
 */
export function createSuccessResponse<T>(data: T, statusCode: number = 200): NextResponse {
  return NextResponse.json(data, { status: statusCode });
}

/**
 * Obsługuje błędy API i zwraca odpowiednią odpowiedź
 */
export function handleApiError(error: unknown): NextResponse {
  if (error instanceof ApiError) {
    return createErrorResponse(error.message, error.statusCode);
  }
  
  if (error instanceof Error) {
    console.error('API Error:', error);
    return createErrorResponse('Wystąpił błąd podczas przetwarzania żądania', 500);
  }
  
  return createErrorResponse('Nieznany błąd', 500);
}

