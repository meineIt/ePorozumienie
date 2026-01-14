/**
 * Narzędzia do sanitizacji danych użytkownika przed zapisem do bazy danych
 * Usuwa niebezpieczne znaki HTML i zapobiega atakom XSS
 */

/**
 * Mapowanie znaków HTML do encji
 */
const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
};

/**
 * Escape'uje znaki HTML w stringu
 */
function escapeHtml(text: string): string {
  return text.replace(/[&<>"'/]/g, (char) => HTML_ESCAPE_MAP[char] || char);
}

/**
 * Sanityzuje ogólny string - usuwa niebezpieczne znaki HTML
 * Używane dla tytułów, kategorii itp.
 */
export function sanitizeString(input: string | null | undefined): string {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  // Trim i escape HTML
  return escapeHtml(input.trim());
}

/**
 * Sanityzuje dłuższy tekst - usuwa niebezpieczne znaki HTML
 * Zachowuje formatowanie (nowe linie, spacje)
 * Używane dla opisów, feedback, wiadomości
 */
export function sanitizeText(input: string | null | undefined): string {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  // Trim i escape HTML
  // Zachowujemy nowe linie - będą renderowane przez whitespace-pre-wrap w React
  return escapeHtml(input.trim());
}

/**
 * Sanityzuje imię/nazwisko - bardziej restrykcyjna
 * Usuwa HTML i pozwala tylko na litery, spacje, myślniki, apostrofy
 * Używane dla firstName, lastName
 */
export function sanitizeName(input: string | null | undefined): string {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  // Trim
  let sanitized = input.trim();
  
  // Escape HTML
  sanitized = escapeHtml(sanitized);
  
  // Usuń niebezpieczne znaki, zostaw tylko litery, spacje, myślniki, apostrofy, polskie znaki
  // Pozwalamy na: a-z, A-Z, spacje, myślniki (-), apostrofy ('), polskie znaki diakrytyczne
  sanitized = sanitized.replace(/[^a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s\-']/g, '');
  
  // Usuń wielokrotne spacje
  sanitized = sanitized.replace(/\s+/g, ' ');
  
  return sanitized.trim();
}
