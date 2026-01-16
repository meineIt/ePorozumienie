/**
 * Escape'uje znaki HTML w stringu dla bezpiecznego wyświetlania w React
 * React już to robi automatycznie, ale to zapewnia dodatkową warstwę bezpieczeństwa
 */
export function escapeHtml(text: string | null | undefined): string {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  const HTML_ESCAPE_MAP: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  
  return text.replace(/[&<>"'/]/g, (char) => HTML_ESCAPE_MAP[char] || char);
}

/**
 * Komponent React do bezpiecznego wyświetlania tekstu z zachowaniem formatowania
 * Używany dla opisów, feedback itp. gdzie potrzebne są nowe linie
 */
export function SafeText({ 
  children, 
  className = '',
  preserveWhitespace = false 
}: { 
  children: string | null | undefined;
  className?: string;
  preserveWhitespace?: boolean;
}) {
  if (!children) {
    return null;
  }
  
  const escaped = escapeHtml(children);
  const whitespaceClass = preserveWhitespace ? 'whitespace-pre-wrap' : '';
  
  return (
    <span className={`${whitespaceClass} ${className}`}>
      {escaped}
    </span>
  );
}
