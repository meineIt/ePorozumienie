'use client';

import { useState, useEffect } from 'react';
import { escapeHtml } from '@/lib/utils/escapeHtml';
import { apiPatch } from '@/lib/api/client';
import { User, ProfileUpdateResponse } from '@/lib/api/types';

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
          console.error('Error parsing user data from localStorage:', error);
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

      const data = await apiPatch<ProfileUpdateResponse>("/api/profile", 
       {   firstName: firstName.trim(),
          lastName: lastName.trim()
      }
    );
      
      const updatedUser = { ...user,firstName: data.user.firstName, lastName: data.user.lastName, updatedAt: typeof data.user.updatedAt === 'string' ? data.user.updatedAt : data.user.updatedAt.toISOString()};
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      setSaveMessage({ type: 'success', text: 'Profil został zaktualizowany pomyślnie!' });
      setHasChanges(false);
      
      // Ukryj komunikat po 3 sekundach
      setTimeout(() => {
        setSaveMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
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
      <div className="max-w-[1200px] mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header - zgodny ze stylem innych stron dashboardu */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#212121] leading-tight">
            Mój Profil
          </h1>
        </div>
        
        <div className="card overflow-hidden">
            
            <div className="card-padding">
              <div className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center space-x-6 pb-6">
                  <div className="w-24 h-24 rounded-full bg-[#0A2463] text-white flex items-center justify-center text-3xl font-semibold">
                    {`${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {escapeHtml(firstName)} {escapeHtml(lastName)}
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
                        ? 'bg-[#0A2463] text-white hover:bg-[#051740] cursor-pointer'
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