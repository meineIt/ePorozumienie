/**
 * Szablon emaila z kodem rabatowym dla użytkownika
 */
export function getDiscountConfirmationEmailTemplate(userName: string, discountCode?: string): string {
  const code = discountCode || process.env.RABAT_CODE || 'RABAT30';
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0A2463;">Dziękujemy za zapis!</h2>
      <p>Witaj ${userName},</p>
      <p>Otrzymałeś kod rabatowy na 30% zniżki na pierwszą mediację w e-Porozumienie!</p>
      <div style="background-color: #0A2463; color: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
        <p style="margin: 0; font-size: 14px; color: #BBDEFB;">Twój kod rabatowy:</p>
        <p style="margin: 10px 0 0 0; font-size: 32px; font-weight: bold; letter-spacing: 3px;">${code}</p>
      </div>
      <p>Użyj tego kodu podczas rejestracji lub przy tworzeniu pierwszej sprawy, aby otrzymać 30% zniżki.</p>
      <p style="margin-top: 30px; color: #616161; font-size: 14px;">
        Pozdrawiamy,<br>
        Zespół e-Porozumienie
      </p>
    </div>
  `;
}

