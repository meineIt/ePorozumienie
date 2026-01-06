'use client';

import { useState, FormEvent, useEffect, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import FormInput from './FormInput';
import SubmitButton from './SubmitButton';
import TrustedProfileButton from './TrustedProfileButton';
import AuthFooter from './AuthFooter';
import ErrorMessage from './ErrorMessage';
import SuccessMessage from './SuccessMessage';
import FormHelper from './FormHelper';
import { useShake } from './hooks/useShake';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { triggerShake } = useShake();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Sprawdź czy użytkownik został zarejestrowany
  const isRegistered = useMemo(() => {
    return searchParams.get('registered') === 'true';
  }, [searchParams]);
  
  const [success, setSuccess] = useState(() => searchParams.get('registered') === 'true');
  
  useEffect(() => {
    if (isRegistered) {
      const timer = setTimeout(() => {
        setSuccess(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isRegistered]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    setError('');
    setLoading(true);

    try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Włącz cookies
          body: JSON.stringify({
            email,
            password,
          }),
        });
    
        const data = await response.json();
    
        if (!response.ok) {
          setError(data.error || 'Nieprawidłowy email lub hasło. Spróbuj ponownie.');
          setLoading(false);
          triggerShake();
          return;
        }
    
        // Sukces - zapisz token i dane użytkownika
        // Token jest już w httpOnly cookie, ale zapisujemy też w localStorage dla kompatybilności
        if (data.token) {
          localStorage.setItem('auth-token', data.token);
        }
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
    
        // Przekieruj do dashboardu
        router.push('/dashboard');
      } catch {
        setError('Wystąpił błąd połączenia. Spróbuj ponownie.');
        setLoading(false);
        triggerShake();
      }
  };

  return (
    <>
      <SuccessMessage 
        message={success ? 'Rejestracja zakończona pomyślnie! Możesz się teraz zalogować.' : ''} 
      />
      
      <ErrorMessage message={error} />
      
      <form onSubmit={handleSubmit}>
        <FormInput
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="Twój adres email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <FormInput
          id="password"
          name="password"
          type="password"
          label="Hasło"
          placeholder="Twoje hasło"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        <FormHelper
          checkboxLabel="Zapamiętaj mnie"
          linkText="Zapomniałeś hasła?"
          linkHref="#"
          checked={remember}
          onChange={setRemember}
        />
        
        <SubmitButton
          loading={loading}
          loadingText="Logowanie..."
          text="Zaloguj się"
        />
      </form>
      
      <div className="divider-text"><span>lub</span></div>
      
      <TrustedProfileButton text="Zaloguj przez Profil Zaufany" />
      
      <AuthFooter
        question="Nie masz jeszcze konta?"
        linkText="Zarejestruj się"
        linkHref="/register"
      />
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Ładowanie...</p>
      </div>
    }>
      <LoginFormContent />
    </Suspense>
  );
}

