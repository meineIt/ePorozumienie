/**
 * Szablon emaila z zaproszeniem do sprawy dla drugiej strony
 */
export function getAffairInviteEmailTemplate(affairTitle: string, inviteLink: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <p>Witaj,</p>
      <p>Zostałeś zaproszony do udziału w mediacji w sprawie:</p>
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; font-weight: bold; color: #0A2463; font-size: 18px;">${affairTitle}</p>
      </div>
      <p>Aby dołączyć do sprawy i rozpocząć proces mediacji, utworz konto w systemie e-Porozumienie.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${inviteLink}" style="display: inline-block; background-color: #0A2463; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px;">
          Utwórz konto i dołącz do sprawy
        </a>
      </div>
      <p style="color: #616161; font-size: 14px; margin-top: 20px;">
        Lub skopiuj i wklej poniższy link do przeglądarki:<br>
        <a href="${inviteLink}" style="color: #0A2463; word-break: break-all;">${inviteLink}</a>
      </p>
      <p style="color: #616161; font-size: 14px; margin-top: 20px;">
        Po utworzeniu konta, sprawa zostanie automatycznie przypisana do Twojego konta i będziesz mógł uczestniczyć w procesie mediacji.
      </p>
      <p style="margin-top: 30px; color: #616161; font-size: 14px;">
        Pozdrawiamy,<br>
        Zespół e-Porozumienie
      </p>
    </div>
  `;
}

