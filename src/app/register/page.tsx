'use client';

import '@/styles/auth.css';
import AuthLayout from '../components/auth/AuthLayout';
import AuthFormHeader from '../components/auth/AuthFormHeader';
import RegisterForm from '../components/auth/RegisterForm';
import { useShake } from '../components/auth/hooks/useShake';
import Navigation from '../components/indexPageSections/Navigation';


export default function RegisterPage() {
  const { shake } = useShake();

  return (
    <>
    <Navigation />
    <AuthLayout shake={shake}>
    <AuthFormHeader
      title="Utwórz konto"
      description="Zarejestruj się, aby rozpocząć korzystanie z platformy."
    />
    <RegisterForm />
    </AuthLayout>
    </>
  );
}