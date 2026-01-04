'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardNavbar from '../../components/dashboard/DashboardNavbar';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(() => {
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

      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 pt-24 ml-64">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="bg-blue-600 px-6 py-4">
              <h1 className="text-2xl font-bold text-white">Mój Profil</h1>
            </div>
            
            <div className="px-6 py-8">
              <div className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center space-x-6 pb-6 border-b">
                  <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-semibold">
                    {`${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {user.firstName} {user.lastName}
                    </h2>
                    <p className="text-gray-600">{user.email}</p>
                  </div>
                </div>

                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Informacje osobowe</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Imię
                      </label>
                      <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded-md border">
                        {user.firstName}
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nazwisko
                      </label>
                      <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded-md border">
                        {user.lastName}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Account Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Informacje o koncie</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded-md border">
                        {user.email}
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ID użytkownika
                      </label>
                      <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded-md border text-sm font-mono">
                        {user.id}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Account Dates */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Historia konta</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {user.createdAt && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Data utworzenia konta
                        </label>
                        <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded-md border">
                          {new Date(user.createdAt).toLocaleString('pl-PL')}
                        </p>
                      </div>
                    )}
                    
                    {user.updatedAt && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ostatnia aktualizacja
                        </label>
                        <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded-md border">
                          {new Date(user.updatedAt).toLocaleString('pl-PL')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-6 border-t">
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Edytuj profil
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}