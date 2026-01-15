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

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include', // Włącz cookies
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (jsonError) {
        // Jeśli response nie jest JSON, użyj domyślnego komunikatu
        console.error('Error parsing error response JSON:', jsonError);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    try {
      return await response.json();
    } catch (jsonError) {
      console.error('Error parsing success response JSON:', jsonError);
      throw new Error('Invalid response format from server');
    }
  } catch (error) {
    // Obsługa błędów sieciowych
    if (error instanceof TypeError && error.message.includes('fetch')) {
      // Błąd sieciowy (brak połączenia, timeout, etc.)
      console.error('Network error:', error);
      throw new Error('Brak połączenia z serwerem. Sprawdź swoje połączenie internetowe.');
    } else if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error('Request aborted:', error);
        throw new Error('Żądanie zostało anulowane.');
      } else if (error.message.includes('Connection closed') || error.message.includes('Failed to fetch')) {
        console.error('Connection error:', error);
        throw new Error('Połączenie zostało przerwane. Spróbuj ponownie.');
      }
      // Jeśli to już Error z komunikatem, przekaż dalej
      throw error;
    }
    // Dla innych typów błędów
    console.error('Unknown error:', error);
    throw new Error('Wystąpił nieoczekiwany błąd. Spróbuj ponownie.');
  }
}

/**
 * Wykonuje POST request z autentykacją
 */
export async function apiPost<T>(endpoint: string, data: unknown): Promise<T> {
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
export async function apiPatch<T>(endpoint: string, data: unknown): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

