'use client';

import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setFirstName(parsedUser.firstName || '');
          setLastName(parsedUser.lastName || '');
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (user) {
      const originalFirstName = user.firstName || '';
      const originalLastName = user.lastName || '';
      setHasChanges(
        firstName.trim() !== originalFirstName || 
        lastName.trim() !== originalLastName
      );
    }
  }, [firstName, lastName, user]);

  const handleSave = async () => {
    if (!user || !hasChanges) return;

    setIsSaving(true);
    setSaveMessage(null);

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;
      if (!token) {
        setSaveMessage({ type: 'error', text: 'Brak autoryzacji. Zaloguj się ponownie.' });
        setIsSaving(false);
        return;
      }

      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Błąd podczas zapisywania');
      }

      const data = await response.json();
      
      // Aktualizuj dane użytkownika w localStorage
      const updatedUser = { ...user, ...data.user };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      setSaveMessage({ type: 'success', text: 'Profil został zaktualizowany pomyślnie!' });
      setHasChanges(false);
      
      // Ukryj komunikat po 3 sekundach
      setTimeout(() => {
        setSaveMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setSaveMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Wystąpił błąd podczas zapisywania' 
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] pt-[70px] lg:pl-[240px]">
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="bg-blue-600 px-6 py-4 relative overflow-hidden">
              {/* Pattern with pluses */}
              <div 
                className="absolute inset-0 opacity-60"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.12'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"), radial-gradient(circle at 30% 70%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)`
                }}
              />
              <h1 className="text-2xl font-bold text-white relative z-10">Mój Profil</h1>
            </div>
            
            <div className="px-6 py-8">
              <div className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center space-x-6 pb-6">
                  <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-semibold">
                    {`${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {firstName} {lastName}
                    </h2>
                    <p className="text-gray-600">{user.email}</p>
                  </div>
                </div>

                {/* Save Message */}
                {saveMessage && (
                  <div className={`p-4 rounded-lg ${
                    saveMessage.type === 'success' 
                      ? 'bg-green-50 text-green-800 border border-green-200' 
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}>
                    {saveMessage.text}
                  </div>
                )}

                {/* Changes Message */}
                {hasChanges && !saveMessage && (
                  <div className="p-4 rounded-lg bg-yellow-50 text-yellow-800 border border-yellow-200">
                    Masz niezapisane zmiany. Kliknij &quot;Zapisz&quot;, aby je zapisać.
                  </div>
                )}

                {/* Personal Information */}
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Imię
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full text-gray-900 bg-white px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nazwisko
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full text-gray-900 bg-white px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Account Information */}
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full text-gray-500 bg-gray-100 px-4 py-2 rounded-md border border-gray-200 cursor-not-allowed"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Email nie może być zmieniony
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-6 flex justify-end">
                  <button
                    onClick={handleSave}
                    disabled={!hasChanges || isSaving}
                    className={`px-6 py-2 rounded-lg transition-colors font-medium ${
                      hasChanges && !isSaving
                        ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isSaving ? 'Zapisywanie...' : 'Zapisz'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}