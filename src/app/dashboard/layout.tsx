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
          return null;
        }
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Ekran ładowania
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7]">
        <div className="text-center">
          <p className="text-[#616161]">Ładowanie...</p>
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
      <DashboardNavbar 
        firstName={user.firstName} 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <DashboardSidebar 
        user={user} 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      {/* Backdrop for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed top-[70px] left-0 right-0 bottom-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {children}
    </>
  );
}

