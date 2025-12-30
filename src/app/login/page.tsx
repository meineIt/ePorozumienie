'use client';

import '@/styles/auth.css';
import AuthLayout from '../components/auth/AuthLayout';
import AuthFormHeader from '../components/auth/AuthFormHeader';
import LoginForm from '../components/auth/LoginForm';
import { useShake } from '../components/auth/hooks/useShake';

export default function RegisterPage() {
  const { shake } = useShake();

  return (
    <AuthLayout shake={shake}>
    <AuthFormHeader
      title="Utwórz konto"
      description="Zarejestruj się, aby rozpocząć korzystanie z platformy."
    />
    <LoginForm />
  </AuthLayout>
  );
}