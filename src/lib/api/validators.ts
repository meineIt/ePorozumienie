import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';
import { badRequest } from './response';
import { DOCUMENT_LIMITS } from '../utils/constants';

/**
 * System walidacji z wykorzystaniem Zod
 * Zapewnia spójną walidację danych wejściowych
 */

/**
 * Wspólne schematy walidacji
 */
export const emailSchema = z.string().email('Nieprawidłowy format email').max(200, 'Email nie może być dłuższy niż 200 znaków');

export const stringSchema = (maxLength: number, fieldName: string = 'Pole') => 
  z.string().min(1, `${fieldName} jest wymagane`).max(maxLength, `${fieldName} nie może być dłuższe niż ${maxLength} znaków`);

export const optionalStringSchema = (maxLength: number) => 
  z.string().max(maxLength).optional().nullable();

export const numberSchema = (min: number = 0, max: number = Number.MAX_SAFE_INTEGER) => 
  z.number().min(min, `Wartość musi być większa lub równa ${min}`).max(max, `Wartość musi być mniejsza lub równa ${max}`);

export const optionalNumberSchema = (min: number = 0, max: number = Number.MAX_SAFE_INTEGER) => 
  z.preprocess(
    (val) => {
      if (val === null || val === undefined || val === '') return null;
      if (typeof val === 'number') return val;
      if (typeof val === 'string') {
        const num = parseFloat(val);
        return isNaN(num) ? null : num;
      }
      return null;
    },
    z.number().min(min).max(max).nullable().optional()
  );

/**
 * Schematy dla konkretnych encji
 */

// Login
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Hasło jest wymagane').max(128, 'Hasło nie może być dłuższe niż 128 znaków'),
});

// Register
export const registerSchema = z.object({
  firstName: stringSchema(100, 'Imię'),
  lastName: stringSchema(100, 'Nazwisko'),
  email: emailSchema,
  password: z.string().min(8, 'Hasło musi mieć co najmniej 8 znaków').max(128, 'Hasło nie może być dłuższe niż 128 znaków'),
  inviteToken: z.string().max(256).optional().nullable(),
});

// Profile update
export const profileUpdateSchema = z.object({
  firstName: stringSchema(100, 'Imię'),
  lastName: stringSchema(100, 'Nazwisko'),
});

// Affair creation
export const createAffairSchema = z.object({
  title: stringSchema(200, 'Tytuł'),
  category: optionalStringSchema(100),
  description: optionalStringSchema(5000),
  disputeValue: optionalNumberSchema(0, 999999999),
  documents: z.array(z.object({
    id: z.string().optional(),
    name: z.string().max(255, 'Nazwa dokumentu nie może być dłuższa niż 255 znaków'),
    size: z.number().optional(),
    type: z.string().optional(),
    category: z.string().optional(),
    path: z.string().nullable().optional(),
  })).max(DOCUMENT_LIMITS.AFFAIR_CREATION),
  otherPartyEmail: emailSchema,
  otherPartyType: z.string().optional(),
  otherPartyPerson: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
  }).optional(),
  otherPartyCompany: z.object({
    companyName: z.string().optional(),
    contactPerson: z.string().optional(),
    nip: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
  }).optional(),
});

// Affair status update
export const updateAffairStatusSchema = z.object({
  status: z.enum(['REACTION_NEEDED', 'WAITING', 'DONE']).refine(
    (val) => ['REACTION_NEEDED', 'WAITING', 'DONE'].includes(val),
    { message: 'Nieprawidłowy status. Dozwolone wartości: REACTION_NEEDED, WAITING, DONE' }
  ),
});

// Party position update
export const updatePartyPositionSchema = z.object({
  description: optionalStringSchema(5000),
  documents: z.array(z.object({
    id: z.string().optional(),
    name: z.string().max(255),
    size: z.number().optional(),
    type: z.string().optional(),
    category: z.string().optional(),
    path: z.string().nullable().optional(),
  })).max(DOCUMENT_LIMITS.PARTY_POSITION),
});

// Contact form
export const contactSchema = z.object({
  name: stringSchema(200, 'Imię'),
  email: emailSchema,
  message: stringSchema(5000, 'Wiadomość'),
  subject: optionalStringSchema(200),
});

// Discount form
export const discountSchema = z.object({
  email: emailSchema,
  name: stringSchema(200, 'Imię'),
});

/**
 * Waliduje body requestu zgodnie z podanym schematem
 * Zwraca zvalidowane dane lub NextResponse z błędem
 */
export async function validateBody<T>(
  schema: z.ZodSchema<T>,
  request: NextRequest
): Promise<T | NextResponse> {
  try {
    const body = await request.json();
    const validated = schema.parse(body);
    return validated;
  } catch (error) {
    console.error('Error validating request body:', error);
    if (error instanceof z.ZodError) {
      // Zwróć pierwszy błąd walidacji
      const firstError = error.issues[0];
      const message = firstError?.message || 'Nieprawidłowe dane wejściowe';
      return badRequest(message);
    }

    // Błąd parsowania JSON
    if (error instanceof SyntaxError) {
      return badRequest('Nieprawidłowy format JSON');
    }

    return badRequest('Błąd walidacji danych');
  }
}

/**
 * Middleware do walidacji body
 */
export function withValidation<T>(schema: z.ZodSchema<T>) {
  return async (request: NextRequest): Promise<T | NextResponse> => {
    return await validateBody(schema, request);
  };
}
