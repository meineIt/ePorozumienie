'use client';

import { useState, useEffect } from 'react';
import AffairsList from '../components/dashboard/DashboardAffairsList';

export default function DashboardPage() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          setUserId(user.id);
        } catch (error) {
        }
      }
    }
  }, []);

  if (!userId) {
    return null;
  }

  return <AffairsList userId={userId} />;
}