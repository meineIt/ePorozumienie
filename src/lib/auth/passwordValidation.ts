/**
 * Walidacja siły hasła
 */
export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validatePasswordStrength(password: string): PasswordValidationResult {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Hasło musi mieć co najmniej 8 znaków');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Hasło musi zawierać co najmniej jedną małą literę');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Hasło musi zawierać co najmniej jedną wielką literę');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Hasło musi zawierać co najmniej jedną cyfrę');
  }

  if (password.length > 128) {
    errors.push('Hasło nie może być dłuższe niż 128 znaków');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}


