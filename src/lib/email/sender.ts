import nodemailer from 'nodemailer';
import { EmailOptions } from '../utils/email';

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

