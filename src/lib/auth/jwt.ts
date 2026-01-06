import jwt, { SignOptions } from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET: string = process.env.JWT_SECRET || 'change-this-secret-key-in-production';
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '7d';

export interface JWTPayload {
  userId: string;
  email: string;
}

/**
 * Generuje JWT token dla użytkownika
 */
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as SignOptions);
}

/**
 * Weryfikuje JWT token i zwraca payload
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Pobiera token z nagłówka Authorization lub z cookies
 */
export function getTokenFromRequest(request: NextRequest): string | null {
  // Sprawdź nagłówek Authorization
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Sprawdź cookie
  const token = request.cookies.get('auth-token')?.value;
  if (token) {
    return token;
  }

  return null;
}

/**
 * Weryfikuje autentykację użytkownika z requestu
 */
export function getAuthenticatedUser(request: NextRequest): JWTPayload | null {
  const token = getTokenFromRequest(request);
  if (!token) {
    return null;
  }

  return verifyToken(token);
}

