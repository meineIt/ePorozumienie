/**
 * Logger dla zdarzeń bezpieczeństwa
 */

interface SecurityEvent {
  type: 'unauthorized_access' | 'rate_limit_exceeded' | 'csrf_failed' | 'invalid_token' | 'suspicious_activity';
  message: string;
  metadata?: Record<string, any>;
  timestamp: Date;
  ip?: string;
  userId?: string;
}

/**
 * Loguje zdarzenie bezpieczeństwa
 */
export function logSecurityEvent(
  type: SecurityEvent['type'],
  message: string,
  metadata?: Record<string, any>,
  request?: { headers: Headers; url?: string }
): void {
  const event: SecurityEvent = {
    type,
    message,
    metadata,
    timestamp: new Date(),
  };

  // Pobierz IP z requestu jeśli dostępny
  if (request) {
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    event.ip = forwardedFor?.split(',')[0]?.trim() || realIp || 'unknown';
  }

  // Loguj w zależności od środowiska
  if (process.env.NODE_ENV === 'production') {
    // W produkcji loguj do konsoli (można później przekierować do systemu logowania)
    console.error('[SECURITY]', JSON.stringify(event));
  } else {
    // W development loguj bardziej czytelnie
    console.warn('[SECURITY EVENT]', {
      type: event.type,
      message: event.message,
      ip: event.ip,
      timestamp: event.timestamp.toISOString(),
      ...event.metadata,
    });
  }

  // TODO: W produkcji można dodać integrację z systemem monitoringu (np. Sentry, DataDog)
}

/**
 * Loguje próbę nieautoryzowanego dostępu
 */
export function logUnauthorizedAccess(
  message: string,
  request?: { headers: Headers; url?: string },
  metadata?: Record<string, any>
): void {
  logSecurityEvent('unauthorized_access', message, metadata, request);
}

/**
 * Loguje przekroczenie rate limitu
 */
export function logRateLimitExceeded(
  message: string,
  request?: { headers: Headers; url?: string },
  metadata?: Record<string, any>
): void {
  logSecurityEvent('rate_limit_exceeded', message, metadata, request);
}

/**
 * Loguje nieudaną weryfikację CSRF
 */
export function logCSRFFailed(
  message: string,
  request?: { headers: Headers; url?: string },
  metadata?: Record<string, any>
): void {
  logSecurityEvent('csrf_failed', message, metadata, request);
}

/**
 * Loguje nieprawidłowy token
 */
export function logInvalidToken(
  message: string,
  request?: { headers: Headers; url?: string },
  metadata?: Record<string, any>
): void {
  logSecurityEvent('invalid_token', message, metadata, request);
}

/**
 * Loguje podejrzaną aktywność
 */
export function logSuspiciousActivity(
  message: string,
  request?: { headers: Headers; url?: string },
  metadata?: Record<string, any>
): void {
  logSecurityEvent('suspicious_activity', message, metadata, request);
}
