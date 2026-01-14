'use client';

import '@/styles/auth.css';
import AuthLayout from '../components/auth/AuthLayout';
import AuthFormHeader from '../components/auth/AuthFormHeader';
import LoginForm from '../components/auth/LoginForm';
import { useShake } from '../components/auth/hooks/useShake';
import Navigation from '../components/indexPageSections/Navigation';

export default function LoginPage() {
  const { shake } = useShake();

  return (
    <>
      <Navigation />
      <AuthLayout shake={shake}>
      <AuthFormHeader
        title="Zaloguj się"
        description="Zaloguj się do swojego konta, aby kontynuować korzystanie z platformy."
      />
      <LoginForm />
      </AuthLayout>
    </>
  );
}