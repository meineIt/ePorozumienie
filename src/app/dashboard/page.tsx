'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardNavbar from '../components/dashboard/DashboardNavbar';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import AffairsList from '../components/dashboard/DashboardAffairsList';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user] = useState<User | null>(() => {
    // Inicjalizacja stanu z localStorage
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sprawdź czy użytkownik istnieje
    if (!user) {
      // Jeśli nie ma danych użytkownika, przekieruj do logowania
      router.push('/login');
      return;
    }
    
    const timer = setTimeout(() => {
      setLoading(false);
    }, 0);
    
    return () => clearTimeout(timer);
  }, [router, user]);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Ładowanie...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
    <DashboardNavbar />
    <DashboardSidebar user={user} />
    <AffairsList userId={user.id} />
    </>
  );
}