/**
 * Walidacja zmiennych środowiskowych na starcie aplikacji
 */

interface EnvValidationResult {
  isValid: boolean;
  missingVars: string[];
  errors: string[];
}

/**
 * Waliduje wymagane zmienne środowiskowe
 */
export function validateEnvironmentVariables(): EnvValidationResult {
  const missingVars: string[] = [];
  const errors: string[] = [];

  // Wymagane zmienne w produkcji
  const requiredInProduction = [
    'JWT_SECRET',
    'CSRF_SECRET',
    'DATABASE_URL',
    'BREVO_API_KEY',
    // 'SMTP_HOST',
    // 'SMTP_USER',
    // 'SMTP_PASSWORD',
  ];

  // Wymagane zmienne w każdym środowisku
  const alwaysRequired: string[] = [];

  // Sprawdź zmienne zawsze wymagane
  for (const varName of alwaysRequired) {
    if (!process.env[varName]) {
      missingVars.push(varName);
      errors.push(`${varName} is required`);
    }
  }

  // Sprawdź zmienne wymagane w produkcji
  if (process.env.NODE_ENV === 'production') {
    for (const varName of requiredInProduction) {
      if (!process.env[varName]) {
        missingVars.push(varName);
        errors.push(`${varName} is required in production`);
      }
    }
  }

  // Walidacja OPENAI_API_KEY (wymagane jeśli używamy AI)
  if (process.env.NODE_ENV === 'production' && !process.env.OPENAI_API_KEY) {
    errors.push('OPENAI_API_KEY is recommended in production if AI features are used');
  }

  return {
    isValid: missingVars.length === 0,
    missingVars,
    errors,
  };
}

/**
 * Waliduje zmienne środowiskowe i rzuca błąd jeśli są problemy w produkcji
 */
export function ensureEnvironmentVariables(): void {
  const validation = validateEnvironmentVariables();
  
  if (!validation.isValid && process.env.NODE_ENV === 'production') {
    const errorMessage = `Missing required environment variables:\n${validation.errors.join('\n')}`;
    throw new Error(errorMessage);
  }
  
  if (validation.errors.length > 0 && process.env.NODE_ENV === 'production') {
    console.warn('Environment variable warnings:', validation.errors.join(', '));
  }
}
