import { ContactFormData } from '../../utils/email';

/**
 * Szablon emaila z formularza kontaktowego dla administratora
 */
export function getContactEmailTemplate(data: ContactFormData): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0A2463;">Nowa wiadomość z formularza kontaktowego</h2>
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Od:</strong> ${data.name} (${data.email})</p>
        ${data.subject ? `<p><strong>Temat:</strong> ${data.subject}</p>` : ''}
        <p><strong>Wiadomość:</strong></p>
        <p style="white-space: pre-wrap; margin-top: 10px;">${data.message}</p>
      </div>
      <p style="color: #616161; font-size: 12px; margin-top: 20px;">
        Wiadomość wysłana z systemu e-Porozumienie
      </p>
    </div>
  `;
}

