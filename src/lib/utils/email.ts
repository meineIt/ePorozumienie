import { sendBrevoEmail as sendEmailFromSender } from '../email/sender';
import { getContactEmailTemplate } from '../email/templates/contact';
import { getContactConfirmationEmailTemplate } from '../email/templates/contactConfirmation';
import { getDiscountEmailTemplate } from '../email/templates/discount';
import { getDiscountConfirmationEmailTemplate } from '../email/templates/discountConfirmation';
import { getAffairInviteEmailTemplate } from '../email/templates/affairInvite';

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

export async function sendContactEmail(data: ContactFormData): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_FROM || 'eporozumienie@gmail.com';
    const subject = data.subject || `Wiadomość z formularza kontaktowego od ${data.name}`;
    const html = getContactEmailTemplate(data);

    return sendEmailFromSender({
        to: adminEmail,
        subject,
        html,
    });
}
export async function sendContactConfirmationEmail(userEmail: string, userName: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const subject = 'Potwierdzenie otrzymania wiadomości - e-Porozumienie';
    const html = getContactConfirmationEmailTemplate(userName);

    return sendEmailFromSender({
        to: userEmail,
        subject,
        html,
    });
}
export async function sendDiscountEmail(data: DiscountFormData): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_FROM || 'eporozumienie@gmail.com';
    const subject = `Nowy zapis na zniżkę 30% - ${data.name}`;
    const html = getDiscountEmailTemplate(data);

    return sendEmailFromSender({
        to: adminEmail,
        subject,
        html,
    });
}
export async function sendDiscountConfirmationEmail(userEmail: string, userName: string, discountCode?: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const subject = 'Twój kod rabatowy 30% - e-Porozumienie';
    const html = getDiscountConfirmationEmailTemplate(userName, discountCode);

    return sendEmailFromSender({
        to: userEmail,
        subject,
        html,
    });
}
export async function sendAffairInviteEmail(userEmail: string, affairTitle: string, token: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const inviteLink = `${baseUrl}/register?token=${token}`;
    const subject = `Zaproszenie do mediacji - ${affairTitle}`;
    const html = getAffairInviteEmailTemplate(affairTitle, inviteLink);

    return sendEmailFromSender({
        to: userEmail,
        subject,
        html,
    });
}