// import nodemailer from 'nodemailer';
import { EmailOptions } from '../utils/email';

// function validateSMTPConfig(): void {
//     if (!process.env.SMTP_HOST) {
//         if (process.env.NODE_ENV === 'production') {
//             throw new Error('SMTP_HOST environment variable is required in production');
//         }
//         throw new Error('SMTP_HOST environment variable is required. Please set it in your .env file');
//     }

//     if (process.env.NODE_ENV === 'production') {
//         if (!process.env.SMTP_USER) {
//             throw new Error('SMTP_USER environment variable is required in production');
//         }
//         if (!process.env.SMTP_PASSWORD) {
//             throw new Error('SMTP_PASSWORD environment variable is required in production');
//         }
//     }
// }

// function createTransporter() {
//     validateSMTPConfig();

//     return nodemailer.createTransport({
//         host: process.env.SMTP_HOST!,
//         port: parseInt(process.env.SMTP_PORT || '587'),
//         secure: process.env.SMTP_SECURE === 'true',
//         auth: {
//             user: process.env.SMTP_USER,
//             pass: process.env.SMTP_PASSWORD,
//         },
//     });
// }
// export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
//     try {
//         const transporter = createTransporter();
//         const fromEmail = options.from || process.env.EMAIL_FROM;

//         const info = await transporter.sendMail({
//             from: fromEmail,
//             to: options.to,
//             subject: options.subject,
//             html: options.html,
//             text: options.text || options.html.replace(/<[^>]*>/g, ''),
//         });

//         return {
//             success: true,
//             messageId: info.messageId,
//         };
//     } catch (error) {
//         console.error('Error sending email:', error);
//         return {
//             success: false,
//             error: error instanceof Error ? error.message : 'Unknown error',
//         };
//     }
// }

function validateBrevoConfig(): string {
    if (!process.env.BREVO_API_KEY) {
        throw new Error('Ustaw BREVO_API_KEY');
    } else {
        return process.env.BREVO_API_KEY
    }
}

export async function sendBrevoEmail(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {

    try {    
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': validateBrevoConfig(),
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                sender: {
                  name: "Zespół e-Porozumienie",
                  email: "kontakt@mail.eporozumienie.pl"
                },
                to: [
                  {
                    email: options.to,
                    name: 'Użytkownik'
                  }
                ],
                subject: options.subject,
                htmlContent: options.html
              })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        return {
            success: true,
            messageId: data.messageId,
        };
    } catch (error) {
        console.error('Error sending email:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}