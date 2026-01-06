'use client';

import { useState } from 'react';

interface ContactFormProps {
  userEmail?: string;
  userName?: string;
}

export default function ContactForm({ userEmail, userName }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: userName || '',
    email: userEmail || '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Wystąpił błąd podczas wysyłania wiadomości');
      }

      setSubmitStatus({
        type: 'success',
        message: 'Wiadomość została wysłana pomyślnie! Skontaktujemy się z Tobą wkrótce.',
      });

      // Reset formularza
      setFormData({
        name: userName || '',
        email: userEmail || '',
        subject: '',
        message: '',
      });
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Wystąpił błąd podczas wysyłania wiadomości',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-gradient-to-br from-[#0A2463] to-[#3E5C95] px-6 py-4">
        <h1 className="text-2xl font-bold text-white">Skontaktuj się z nami</h1>
        <p className="text-blue-100 text-sm mt-1">Masz pytania? Pojawił sie błąd?</p>
      </div>

      <div className="px-6 py-8">
        {submitStatus.type && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              submitStatus.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            <div className="flex items-center">
              {submitStatus.type === 'success' ? (
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              <p>{submitStatus.message}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
              Temat
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A2463] focus:border-transparent outline-none transition-all"
              placeholder="Temat wiadomości"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Wiadomość <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A2463] focus:border-transparent outline-none transition-all resize-none"
              placeholder="Napisz swoją wiadomość..."
            />
          </div>

          <div className="flex justify-end pt-4 border-t">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-gradient-to-br from-[#0A2463] to-[#3E5C95] text-white rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Wysyłanie...
                </>
              ) : (
                <>
                  Wyślij
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

