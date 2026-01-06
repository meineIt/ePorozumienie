/**
 * Szablon emaila potwierdzającego otrzymanie wiadomości kontaktowej
 */
export function getContactConfirmationEmailTemplate(userName: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0A2463;">Dziękujemy za kontakt!</h2>
      <p>Witaj ${userName},</p>
      <p>Otrzymaliśmy Twoją wiadomość i skontaktujemy się z Tobą w najbliższym czasie.</p>
      <p style="margin-top: 30px; color: #616161; font-size: 14px;">
        Pozdrawiamy,<br>
        Zespół e-Porozumienie
      </p>
    </div>
  `;
}

