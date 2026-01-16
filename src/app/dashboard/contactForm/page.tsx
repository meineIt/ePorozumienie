'use client';

import { useState, useEffect } from 'react';
import ContactForm from '@/app/components/dashboard/ContactForm';
import { User } from '@/lib/types';


export default function ContactFormPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          if (parsedUser &&
              typeof parsedUser.id === 'string' &&
              typeof parsedUser.email === 'string' &&
              typeof parsedUser.firstName === 'string' &&
              typeof parsedUser.lastName === 'string')  {
            setUser(parsedUser as User);
              }
        } catch {
        }
      }
    }
  }, []);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] pt-[70px] lg:pl-[240px]">
      <div className="max-w-[1200px] mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#212121] leading-tight">
            Skontaktuj się z nami
            <p className="text-[#212121] text-sm mt-1 relative z-10">Masz pytania? Pojawił sie błąd?</p>
          </h1>
        </div>
        <ContactForm 
          userEmail={user.email}
          userName={`${user.firstName} ${user.lastName}`}
        />
      </div>
    </div>
  );
}

