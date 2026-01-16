'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardNavbar from '../components/dashboard/DashboardNavbar';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import { User } from '@/lib/types';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Weryfikuj autentykację przez API call
    const verifyAuth = async () => {
      try {
        // Pobierz token z localStorage jako fallback (jeśli cookie nie jest dostępne)
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;
        
        const headers: HeadersInit = {};
        // Dodaj token w nagłówku Authorization jako fallback
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch('/api/profile', {
          method: 'GET',
          headers,
          credentials: 'include',
        });

        if (!response.ok) {
          // Jeśli 401, użytkownik nie jest zalogowany
          if (response.status === 401) {
            // Wyczyść localStorage i przekieruj do logowania
            localStorage.removeItem('user');
            localStorage.removeItem('auth-token');
            router.push('/login');
            return;
          }
          // Inny błąd - przekieruj do logowania
          localStorage.removeItem('user');
          localStorage.removeItem('auth-token');
          router.push('/login');
          return;
        }

        const data = await response.json();
        if (data.user) {
          // Zaktualizuj localStorage z danymi z serwera
          localStorage.setItem('user', JSON.stringify(data.user));
          setUser(data.user);
        } else {
          // Brak danych użytkownika
          localStorage.removeItem('user');
          localStorage.removeItem('auth-token');
          router.push('/login');
          return;
        }
      } catch (error) {
        // Błąd połączenia - przekieruj do logowania
        console.error('Auth verification error:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('auth-token');
        router.push('/login');
        return;
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [router]);

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

