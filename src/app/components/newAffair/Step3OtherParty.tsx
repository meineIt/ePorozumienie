'use client';

import { useState } from 'react';
import { Step3OtherPartyProps } from '@/lib/types';


export default function Step3OtherParty({
  formData,
  updateFormData,
  onNext,
  onPrev,
}: Step3OtherPartyProps) {
  const [knowsOtherParty, setKnowsOtherParty] = useState(formData.knowsOtherParty ?? true);
  const [otherPartyType, setOtherPartyType] = useState<'person' | 'company'>(formData.otherPartyType || 'person');

  // Local state for person data
  const [personData, setPersonData] = useState({
    firstName: formData.otherPartyPerson?.firstName || '',
    lastName: formData.otherPartyPerson?.lastName || '',
    email: formData.otherPartyPerson?.email || '',
    phone: formData.otherPartyPerson?.phone || '',
  });

  // Local state for company data
  const [companyData, setCompanyData] = useState({
    companyName: formData.otherPartyCompany?.companyName || '',
    contactPerson: formData.otherPartyCompany?.contactPerson || '',
    nip: formData.otherPartyCompany?.nip || '',
    email: formData.otherPartyCompany?.email || '',
    phone: formData.otherPartyCompany?.phone || '',
  });

  const [customMessage, setCustomMessage] = useState(formData.customMessage || '');
  const [notifyEmail, setNotifyEmail] = useState(formData.notifyEmail ?? true);
  const [notifySMS, setNotifySMS] = useState(formData.notifySMS ?? false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFormData({
      knowsOtherParty,
      otherPartyType,
      otherPartyPerson: otherPartyType === 'person' ? personData : undefined,
      otherPartyCompany: otherPartyType === 'company' ? companyData : undefined,
      customMessage,
      notifyEmail,
      notifySMS,
    });
    onNext();
  };

  return (
    <form onSubmit={handleSubmit}>

      {/* Info box */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-700 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Dlaczego te informacje są ważne?</h4>
            <p className="text-sm text-gray-700">
              Uzupełnienie danych drugiej strony pozwoli na szybkie rozpoczęcie procesu mediacji. Druga strona otrzyma powiadomienie o chęci zawarcia porozumienia.
            </p>
          </div>
        </div>
      </div>

      {/* Rozpoznanie drugiej strony */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <svg className="w-5 h-5 text-blue-700 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <h3 className="text-lg font-semibold text-blue-700">Rozpoznanie drugiej strony</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
            <input
              type="radio"
              name="knowsOtherParty"
              checked={knowsOtherParty}
              onChange={() => setKnowsOtherParty(true)}
              className="w-5 h-5 text-blue-600 mr-3"
            />
            <span className="font-medium text-gray-700">Znam drugą stronę i mam jej dane kontaktowe</span>
          </label>

          <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
            <input
              type="radio"
              name="knowsOtherParty"
              checked={!knowsOtherParty}
              onChange={() => setKnowsOtherParty(false)}
              className="w-5 h-5 text-blue-600 mr-3"
            />
            <span className="font-medium text-gray-700">Nie znam danych kontaktowych drugiej strony</span>
          </label>
        </div>

        {!knowsOtherParty && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
            <p className="text-sm text-gray-700">
              Jeśli nie znasz danych kontaktowych drugiej strony, ale posiadasz nazwę firmy lub inne informacje identyfikujące, wprowadź je poniżej.
            </p>
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rodzaj podmiotu *
          </label>
          <select
            value={otherPartyType}
            onChange={(e) => setOtherPartyType(e.target.value as 'person' | 'company')}
            className="w-full px-4 py-2 border-[1.5px] border-gray-300 rounded-xl bg-white focus:outline-none focus:border-[#0A2463] focus:ring-0 focus:shadow-[0_0_0_3px_rgba(10,36,99,0.25)] appearance-none"
          >
            <option value="person">Osoba fizyczna</option>
            <option value="company">Firma / Organizacja</option>
          </select>
        </div>

        {/* Osoba fizyczna */}
        {otherPartyType === 'person' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Imię *</label>
                <input
                  type="text"
                  value={personData.firstName}
                  onChange={(e) => setPersonData({ ...personData, firstName: e.target.value })}
                  className="w-full px-4 py-2 border-[1.5px] border-gray-300 rounded-xl focus:outline-none focus:border-[#0A2463] focus:ring-0 focus:shadow-[0_0_0_3px_rgba(10,36,99,0.25)]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nazwisko *</label>
                <input
                  type="text"
                  value={personData.lastName}
                  onChange={(e) => setPersonData({ ...personData, lastName: e.target.value })}
                  className="w-full px-4 py-2 border-[1.5px] border-gray-300 rounded-xl focus:outline-none focus:border-[#0A2463] focus:ring-0 focus:shadow-[0_0_0_3px_rgba(10,36,99,0.25)]"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={personData.email}
                  onChange={(e) => setPersonData({ ...personData, email: e.target.value })}
                  className="w-full px-4 py-2 border-[1.5px] border-gray-300 rounded-xl focus:outline-none focus:border-[#0A2463] focus:ring-0 focus:shadow-[0_0_0_3px_rgba(10,36,99,0.25)]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                <input
                  type="tel"
                  value={personData.phone}
                  onChange={(e) => setPersonData({ ...personData, phone: e.target.value })}
                  className="w-full px-4 py-2 border-[1.5px] border-gray-300 rounded-xl focus:outline-none focus:border-[#0A2463] focus:ring-0 focus:shadow-[0_0_0_3px_rgba(10,36,99,0.25)]"
                  placeholder="np. +48 500 100 100"
                />
              </div>
            </div>
          </div>
        )}

        {/* Firma */}
        {otherPartyType === 'company' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nazwa firmy/organizacji *</label>
                <input
                  type="text"
                  value={companyData.companyName}
                  onChange={(e) => setCompanyData({ ...companyData, companyName: e.target.value })}
                  className="w-full px-4 py-2 border-[1.5px] border-gray-300 rounded-xl focus:outline-none focus:border-[#0A2463] focus:ring-0 focus:shadow-[0_0_0_3px_rgba(10,36,99,0.25)]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">NIP</label>
                <input
                  type="text"
                  value={companyData.nip}
                  onChange={(e) => setCompanyData({ ...companyData, nip: e.target.value })}
                  className="w-full px-4 py-2 border-[1.5px] border-gray-300 rounded-xl focus:outline-none focus:border-[#0A2463] focus:ring-0 focus:shadow-[0_0_0_3px_rgba(10,36,99,0.25)]"
                  placeholder="np. 1234567890"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Osoba kontaktowa</label>
              <input
                type="text"
                value={companyData.contactPerson}
                onChange={(e) => setCompanyData({ ...companyData, contactPerson: e.target.value })}
                className="w-full px-4 py-2 border-[1.5px] border-gray-300 rounded-xl focus:outline-none focus:border-[#0A2463] focus:ring-0 focus:shadow-[0_0_0_3px_rgba(10,36,99,0.25)]"
                placeholder="Imię i nazwisko"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email firmowy *</label>
                <input
                  type="email"
                  value={companyData.email}
                  onChange={(e) => setCompanyData({ ...companyData, email: e.target.value })}
                  className="w-full px-4 py-2 border-[1.5px] border-gray-300 rounded-xl focus:outline-none focus:border-[#0A2463] focus:ring-0 focus:shadow-[0_0_0_3px_rgba(10,36,99,0.25)]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefon firmowy</label>
                <input
                  type="tel"
                  value={companyData.phone}
                  onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
                  className="w-full px-4 py-2 border-[1.5px] border-gray-300 rounded-xl focus:outline-none focus:border-[#0A2463] focus:ring-0 focus:shadow-[0_0_0_3px_rgba(10,36,99,0.25)]"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Wiadomość do drugiej strony */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <svg className="w-5 h-5 text-blue-700 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-semibold text-blue-700">Wiadomość do drugiej strony</h3>
        </div>

        <p className="text-gray-600 mb-4">
          Druga strona otrzyma powiadomienie o chęci zawarcia porozumienia. Możesz dodać własną wiadomość.
        </p>

        <textarea
          rows={4}
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value)}
          className="w-full px-4 py-2 border-[1.5px] border-gray-300 rounded-xl focus:outline-none focus:border-[#0A2463] focus:ring-0 focus:shadow-[0_0_0_3px_rgba(10,36,99,0.25)]"
          placeholder="Wprowadź dodatkowe informacje dla drugiej strony..."
        />
      </div>

      {/* Sposób powiadomienia */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <svg className="w-5 h-5 text-blue-700 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <h3 className="text-lg font-semibold text-blue-700">Sposób powiadomienia</h3>
        </div>

        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={notifyEmail}
              onChange={(e) => setNotifyEmail(e.target.checked)}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">Powiadomienie e-mail</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={notifySMS}
              onChange={(e) => setNotifySMS(e.target.checked)}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">Powiadomienie SMS (jeśli podano numer telefonu) - nieaktywne</span>
          </label>
        </div>
      </div>

      {/* Akcje */}
      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={onPrev}
          className="px-6 py-2 border-2 border-blue-300 text-blue-700 rounded-full font-semibold hover:bg-blue-50 transition-colors flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Wróć
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover:shadow-lg hover:-translate-y-0.5 text-white rounded-full font-semibold transition-all duration-300 flex items-center"
        >
          Dalej
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </form>
  );
}