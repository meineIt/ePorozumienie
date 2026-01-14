import nodemailer from 'nodemailer';
import { EmailOptions } from '../utils/email';

function validateSMTPConfig(): void {
    if (!process.env.SMTP_HOST) {
        if (process.env.NODE_ENV === 'production') {
            throw new Error('SMTP_HOST environment variable is required in production');
        }
        throw new Error('SMTP_HOST environment variable is required. Please set it in your .env file');
    }

    if (process.env.NODE_ENV === 'production') {
        if (!process.env.SMTP_USER) {
            throw new Error('SMTP_USER environment variable is required in production');
        }
        if (!process.env.SMTP_PASSWORD) {
            throw new Error('SMTP_PASSWORD environment variable is required in production');
        }
    }
}

function createTransporter() {
    validateSMTPConfig();

    return nodemailer.createTransport({
        host: process.env.SMTP_HOST!,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
        },
    });
}
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
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

