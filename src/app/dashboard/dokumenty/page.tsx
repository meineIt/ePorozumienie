'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardNavbar from '@/app/components/dashboard/DashboardNavbar';
import DashboardSidebar from '@/app/components/dashboard/DashboardSidebar';
import DocumentsList from '@/app/components/dashboard/DocumentsList';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function DocumentsPage() {
  const router = useRouter();
  const [user] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
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
      <DocumentsList userId={user.id} />
    </>
  );
}