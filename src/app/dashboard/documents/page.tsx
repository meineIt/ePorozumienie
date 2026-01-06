'use client';

import { useState, useEffect } from 'react';
import DocumentsList from '@/app/components/dashboard/DocumentsList';

export default function DocumentsPage() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          setUserId(user.id);
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    }
  }, []);

  if (!userId) {
    return null;
  }

  return <DocumentsList userId={userId} />;
}