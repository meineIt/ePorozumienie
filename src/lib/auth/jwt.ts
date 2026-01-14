import jwt, { SignOptions } from 'jsonwebtoken';
import { jwtVerify } from 'jose';
import { NextRequest } from 'next/server';
import { TOKEN_LENGTH_LIMITS } from '@/lib/utils/constants';

function getJWTSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET environment variable is required in production');
    }
    throw new Error('JWT_SECRET environment variable is required. Please set it in your .env file');
  }
  return secret;
}

const JWT_SECRET: string = getJWTSecret();
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
 * Weryfikuje JWT token w Edge Runtime używając jose (kompatybilne z Edge Runtime)
 */
export async function verifyTokenEdge(token: string): Promise<JWTPayload | null> {
  // Walidacja długości tokenu - ochrona przed atakami DoS
  if (token.length > TOKEN_LENGTH_LIMITS.JWT) {
    return null;
  }

  try {
    // jose wymaga secret jako Uint8Array
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    
    // Sprawdź czy payload ma wymagane pola
    if (typeof payload.userId === 'string' && typeof payload.email === 'string') {
      return {
        userId: payload.userId,
        email: payload.email,
      };
    }
    
    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Weryfikuje JWT token i zwraca payload (dla Node.js runtime - API routes)
 */
export function verifyToken(token: string): JWTPayload | null {
  // Walidacja długości tokenu - ochrona przed atakami DoS
  if (token.length > TOKEN_LENGTH_LIMITS.JWT) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch {
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
    const token = authHeader.substring(7);
    // Walidacja długości tokenu - ochrona przed atakami DoS
    if (token.length > TOKEN_LENGTH_LIMITS.JWT) {
      return null;
    }
    return token;
  }

  // Sprawdź cookie
  const token = request.cookies.get('auth-token')?.value;
  if (token) {
    // Walidacja długości tokenu - ochrona przed atakami DoS
    if (token.length > TOKEN_LENGTH_LIMITS.JWT) {
      return null;
    }
    return token;
  }

  return null;
}

/**
 * Weryfikuje autentykację użytkownika z requestu (dla Edge Runtime - middleware)
 */
export async function getAuthenticatedUserEdge(request: NextRequest): Promise<JWTPayload | null> {
  const token = getTokenFromRequest(request);
  if (!token) {
    return null;
  }

  return await verifyTokenEdge(token);
}

/**
 * Weryfikuje autentykację użytkownika z requestu (dla Node.js runtime - API routes)
 */
export function getAuthenticatedUser(request: NextRequest): JWTPayload | null {
  const token = getTokenFromRequest(request);
  if (!token) {
    return null;
  }

  return verifyToken(token);
}

