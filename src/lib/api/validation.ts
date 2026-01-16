/**
 * Funkcje walidacyjne dla API
 */

/**
 * Waliduje czy wszystkie wymagane pola są obecne
 */
export function validateRequiredFields<T extends Record<string, unknown>>(
  data: T,
  requiredFields: (keyof T)[]
): { isValid: boolean; missingFields: string[] } {
  const missingFields: string[] = [];
  
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      missingFields.push(String(field));
    }
  }
  
  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
}

/**
 * Waliduje format emaila
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Waliduje czy string nie jest pusty
 */
export function isNotEmpty(value: string | null | undefined): boolean {
  return value !== null && value !== undefined && value.trim().length > 0;
}

/**
 * Waliduje czy wartość jest liczbą
 */
export function isNumber(value: number): value is number {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * Waliduje czy wartość jest dodatnią liczbą
 */
export function isPositiveNumber(value: unknown): value is number {
    return typeof value === 'number' && !isNaN(value) && value > 0;
}

