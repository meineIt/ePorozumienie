'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardNavbar from '../components/dashboard/DashboardNavbar';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user] = useState<User | null>(() => {
    // Inicjalizacja użytkownika z localStorage przy pierwszym renderze
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          return JSON.parse(userData) as User;
        } catch (error) {
          console.error('Error parsing user data:', error);
          return null;
        }
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sprawdź czy użytkownik istnieje i zakończ ładowanie
    if (!user) {
      router.push('/login');
      return;
    }
    
    // Ustaw loading na false po krótkim opóźnieniu, aby uniknąć migotania
    const timer = setTimeout(() => {
      setLoading(false);
    }, 0);
    
    return () => clearTimeout(timer);
  }, [user, router]);

  // Ekran ładowania
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Ładowanie...</p>
        </div>
      </div>
    );
  }

  // Jeśli nie ma użytkownika, nie renderuj nic (redirect w useEffect)
  if (!user) {
    return null;
  }

  return (
    <>
      <DashboardNavbar firstName={user.firstName} />
      <DashboardSidebar user={user} />
      {children}
    </>
  );
}

