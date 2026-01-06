/**
 * Klient API z autentykacją
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

/**
 * Pobiera token z localStorage lub cookie
 */
function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  // Sprawdź localStorage (dla kompatybilności wstecznej)
  const token = localStorage.getItem('auth-token');
  if (token) return token;
  
  // Token powinien być w httpOnly cookie, ale dla frontend możemy użyć localStorage
  // W produkcji token powinien być tylko w httpOnly cookie
  return null;
}

/**
 * Zapisuje token (dla kompatybilności)
 */
export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('auth-token', token);
}

/**
 * Usuwa token
 */
export function removeToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth-token');
  localStorage.removeItem('user');
}

/**
 * Wykonuje autentykowane zapytanie API
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // Dodaj token do nagłówka jeśli dostępny
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include', // Włącz cookies
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/**
 * Wykonuje POST request z autentykacją
 */
export async function apiPost<T>(endpoint: string, data: any): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Wykonuje GET request z autentykacją
 */
export async function apiGet<T>(endpoint: string): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'GET',
  });
}

/**
 * Wykonuje PATCH request z autentykacją
 */
export async function apiPatch<T>(endpoint: string, data: any): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

