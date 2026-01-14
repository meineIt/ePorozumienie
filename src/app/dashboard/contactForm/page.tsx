'use client';

import { useState, useEffect } from 'react';
import ContactForm from '@/app/components/dashboard/ContactForm';

export default function ContactFormPage() {
  const [user, setUser] = useState<{ email: string; firstName: string; lastName: string } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser({
            email: parsedUser.email,
            firstName: parsedUser.firstName,
            lastName: parsedUser.lastName,
          });
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    }
  }, []);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] pt-[94px] pb-12 px-4 sm:px-6 lg:px-8 lg:pl-[240px]">
      <div className="max-w-3xl mx-auto">
        <ContactForm 
          userEmail={user.email}
          userName={`${user.firstName} ${user.lastName}`}
        />
      </div>
    </div>
  );
}

