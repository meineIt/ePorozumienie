/**
 * Klient API z autentykacją
 */

import { ApiResponse } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Cache dla CSRF tokenu
let csrfTokenCache: string | null = null;
let csrfTokenPromise: Promise<string | null> | null = null;

/**
 * Klasa błędu API
 */
export class ApiClientError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: Response
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

/**
 * Pobiera token z localStorage
 */
function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth-token');
}

/**
 * Pobiera CSRF token z endpointu API
 */
async function getCSRFToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  
  // Jeśli mamy cache, zwróć go
  if (csrfTokenCache) {
    return csrfTokenCache;
  }
  
  // Jeśli już trwa pobieranie tokenu, zwróć istniejące promise
  if (csrfTokenPromise) {
    return csrfTokenPromise;
  }
  
  // Pobierz token
  csrfTokenPromise = (async () => {
    try {
      const token = getToken();
      if (!token) {
        return null;
      }
      
      const response = await fetch(`${API_BASE_URL}/api/csrf-token`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        return null;
      }
      
      const data = await response.json();
      csrfTokenCache = data.csrfToken || null;
      return csrfTokenCache;
    } catch (error) {
      console.error('Error fetching CSRF token:', error);
      return null;
    } finally {
      csrfTokenPromise = null;
    }
  })();
  
  return csrfTokenPromise;
}

/**
 * Resetuje cache CSRF tokenu (np. po wylogowaniu)
 */
export function resetCSRFTokenCache(): void {
  csrfTokenCache = null;
  csrfTokenPromise = null;
}

/**
 * Pobiera nagłówki requestu z autentykacją i opcjonalnie CSRF token
 */
export async function getRequestHeaders(method?: string): Promise<Record<string, string>> {
  const token = getToken();
  const headers: Record<string, string> = {};
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    
    // Dodaj CSRF token tylko dla modyfikujących requestów
    const isModifyingRequest = method && ['POST', 'PATCH', 'PUT', 'DELETE'].includes(method.toUpperCase());
    if (isModifyingRequest) {
      const csrfToken = await getCSRFToken();
      if (csrfToken) {
        headers['x-csrf-token'] = csrfToken;
      }
    }
  }
  
  return headers;
}

/**
 * Zapisuje token
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
  resetCSRFTokenCache();
}

/**
 * Parsuje odpowiedź JSON z obsługą błędów
 */
async function parseJsonResponse<T>(response: Response): Promise<T> {
  try {
    return await response.json();
  } catch (error) {
    console.error('Error parsing JSON response:', error);
    throw new ApiClientError(
      'Nieprawidłowy format odpowiedzi z serwera',
      response.status,
      response
    );
  }
}

/**
 * Obsługuje błędy odpowiedzi HTTP
 */
async function handleErrorResponse(response: Response): Promise<never> {
  let errorMessage = `HTTP error! status: ${response.status}`;
  
  try {
    const errorData = await response.json() as ApiResponse;
    errorMessage = errorData.error || errorMessage;
  } catch {
    // Jeśli response nie jest JSON, użyj domyślnego komunikatu
  }
  
  throw new ApiClientError(errorMessage, response.status, response);
}

/**
 * Obsługuje błędy sieciowe
 */
function handleNetworkError(error: unknown): never {
  if (error instanceof ApiClientError) {
    throw error;
  }
  
  if (error instanceof TypeError && error.message.includes('fetch')) {
    throw new ApiClientError('Brak połączenia z serwerem. Sprawdź swoje połączenie internetowe.');
  }
  
  if (error instanceof Error) {
    if (error.name === 'AbortError') {
      throw new ApiClientError('Żądanie zostało anulowane.');
    }
    
    if (error.message.includes('Connection closed') || error.message.includes('Failed to fetch')) {
      throw new ApiClientError('Połączenie zostało przerwane. Spróbuj ponownie.');
    }
    
    throw new ApiClientError(error.message);
  }
  
  throw new ApiClientError('Wystąpił nieoczekiwany błąd. Spróbuj ponownie.');
}

/**
 * Wykonuje autentykowane zapytanie API
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  
  // Sprawdź czy to request modyfikujący (wymaga CSRF)
  const method = options.method || 'GET';
  const isModifyingRequest = ['POST', 'PATCH', 'PUT', 'DELETE'].includes(method.toUpperCase());
  
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  // Dla requestów JSON, dodaj Content-Type
  if (!headers['Content-Type'] && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  // Dodaj token do nagłówka jeśli dostępny
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    
    // Dodaj CSRF token dla requestów modyfikujących
    if (isModifyingRequest) {
      const csrfToken = await getCSRFToken();
      if (csrfToken) {
        headers['x-csrf-token'] = csrfToken;
      }
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    // Obsługa błędu 403 (CSRF token nieważny) - odśwież token i ponów request
    if (response.status === 403 && isModifyingRequest && token) {
      // Zresetuj cache CSRF tokenu
      resetCSRFTokenCache();
      
      // Pobierz nowy CSRF token
      const newCsrfToken = await getCSRFToken();
      if (newCsrfToken) {
        // Zaktualizuj nagłówki z nowym tokenem
        headers['x-csrf-token'] = newCsrfToken;
        
        // Ponów request z nowym tokenem
        const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
          ...options,
          headers,
          credentials: 'include',
        });

        if (!retryResponse.ok) {
          return handleErrorResponse(retryResponse);
        }

        return parseJsonResponse<T>(retryResponse);
      }
    }

    if (!response.ok) {
      return handleErrorResponse(response);
    }

    return parseJsonResponse<T>(response);
  } catch (error) {
    return handleNetworkError(error);
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

/**
 * Wykonuje PUT request z autentykacją
 */
export async function apiPut<T>(endpoint: string, data: unknown): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Wykonuje DELETE request z autentykacją
 */
export async function apiDelete<T>(endpoint: string): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'DELETE',
  });
}

/**
 * Wykonuje upload plików z autentykacją i CSRF protection
 */
export async function apiUpload<T>(
  endpoint: string,
  formData: FormData
): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: formData,
  });
}
