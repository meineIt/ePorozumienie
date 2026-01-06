import nodemailer from 'nodemailer';

export interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
    from?: string;
}

export interface ContactFormData {
    name: string;
    email: string;
    message: string;
    subject?: string;
}

export interface DiscountFormData {
    name: string;
    email: string;
}

/**
 * Tworzy transporter email używając zmiennych środowiskowych
 */
function createTransporter() {
    // Dla Gmail/SMTP
    if (process.env.SMTP_HOST) {
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });
    }

    // Dla testów - używa ethereal.email (nie wysyła prawdziwych emaili)
    // W produkcji użyj prawdziwego SMTP
    return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'test@ethereal.email',
            pass: 'test',
        },
    });
}

/**
 * Wysyła email
 */
export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
        const transporter = createTransporter();
        const fromEmail = options.from || process.env.EMAIL_FROM || 'noreply@eporozumienie.pl';

        const info = await transporter.sendMail({
            from: fromEmail,
            to: options.to,
            subject: options.subject,
            html: options.html,
            text: options.text || options.html.replace(/<[^>]*>/g, ''),
        });

        return {
            success: true,
            messageId: info.messageId,
        };
    } catch (error) {
        console.error('Email sending error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

/**
 * Wysyła email z formularza kontaktowego
 */
export async function sendContactEmail(data: ContactFormData): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_FROM || 'admin@eporozumienie.pl';
    const subject = data.subject || `Wiadomość z formularza kontaktowego od ${data.name}`;

    const html = `
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

    return sendEmail({
        to: adminEmail,
        subject,
        html,
    });
}

/**
 * Wysyła email potwierdzający do użytkownika
 */
export async function sendContactConfirmationEmail(userEmail: string, userName: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const subject = 'Potwierdzenie otrzymania wiadomości - e-Porozumienie';

    const html = `
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

    return sendEmail({
        to: userEmail,
        subject,
        html,
    });
}

/**
 * Wysyła email o zapisie na zniżkę do administratora
 */
export async function sendDiscountEmail(data: DiscountFormData): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_FROM || 'admin@eporozumienie.pl';
    const subject = `Nowy zapis na zniżkę 30% - ${data.name}`;

    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0A2463;">Nowy zapis na zniżkę 30%</h2>
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Imię:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p style="margin-top: 15px; color: #4CAF50; font-weight: bold;">
          Użytkownik zapisał się, aby otrzymać kod rabatowy 30% na pierwszą mediację.
        </p>
      </div>
      <p style="color: #616161; font-size: 12px; margin-top: 20px;">
        Wiadomość wysłana z systemu e-Porozumienie
      </p>
    </div>
  `;

    return sendEmail({
        to: adminEmail,
        subject,
        html,
    });
}

/**
 * Wysyła email z kodem rabatowym do użytkownika
 */
export async function sendDiscountConfirmationEmail(userEmail: string, userName: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const subject = 'Twój kod rabatowy 30% - e-Porozumienie';
    
    // W produkcji kod rabatowy powinien być generowany dynamicznie
    const discountCode = process.env.RABAT_CODE;

    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0A2463;">Dziękujemy za zapis!</h2>
      <p>Witaj ${userName},</p>
      <p>Otrzymałeś kod rabatowy na 30% zniżki na pierwszą mediację w e-Porozumienie!</p>
      <div style="background-color: #0A2463; color: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
        <p style="margin: 0; font-size: 14px; color: #BBDEFB;">Twój kod rabatowy:</p>
        <p style="margin: 10px 0 0 0; font-size: 32px; font-weight: bold; letter-spacing: 3px;">${discountCode}</p>
      </div>
      <p>Użyj tego kodu podczas rejestracji lub przy tworzeniu pierwszej sprawy, aby otrzymać 30% zniżki.</p>
      <p style="margin-top: 30px; color: #616161; font-size: 14px;">
        Pozdrawiamy,<br>
        Zespół e-Porozumienie
      </p>
    </div>
  `;

    return sendEmail({
        to: userEmail,
        subject,
        html,
    });
}