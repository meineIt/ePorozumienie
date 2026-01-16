'use client';

import { useState, FormEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import FormInput from './FormInput';
import SubmitButton from './SubmitButton';
import TrustedProfileButton from './TrustedProfileButton';
import AuthFooter from './AuthFooter';
import ErrorMessage from './ErrorMessage';
import { useShake } from './hooks/useShake';

function RegisterFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { triggerShake } = useShake();
  const inviteToken = searchParams.get('token');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError('Imię jest wymagane');
      return false;
    }
    if (!formData.lastName.trim()) {
      setError('Nazwisko jest wymagane');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email jest wymagany');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Hasło musi mieć co najmniej 8 znaków');
      return false;
    }
    if (!/[a-z]/.test(formData.password)) {
      setError('Hasło musi zawierać co najmniej jedną małą literę');
      return false;
    }
    if (!/[A-Z]/.test(formData.password)) {
      setError('Hasło musi zawierać co najmniej jedną wielką literę');
      return false;
    }
    if (!/[0-9]/.test(formData.password)) {
      setError('Hasło musi zawierać co najmniej jedną cyfrę');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Hasła nie są identyczne');
      return false;
    }
    if (!formData.acceptTerms) {
      setError('Musisz zaakceptować regulamin');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    setError('');
    
    if (!validateForm()) {
      triggerShake();
      return;
    }
    
    setLoading(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Włącz cookies
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          ...(inviteToken && { inviteToken }),
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        setError(data.error || 'Wystąpił błąd podczas rejestracji');
        setLoading(false);
        triggerShake();
        return;
      }

      // Jeśli rejestracja zakończona sukcesem i otrzymaliśmy token, zapisz go
      if (data.token) {
        localStorage.setItem('auth-token', data.token);
      }
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
  
      // Sukces - przekieruj do logowania (lub dashboard jeśli auto-login)
      router.push('/login?registered=true');
    } catch {
      setError('Wystąpił błąd połączenia. Spróbuj ponownie.');
      setLoading(false);
      triggerShake();
    }
  };

  return (
    <>
      <ErrorMessage message={error} />
      
      {inviteToken && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-5 mb-6 text-blue-900">
          <div className="flex items-center gap-3 mb-3">
            <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <strong className="font-bold text-base">Zaproszenie do sprawy</strong>
          </div>
          <p className="text-sm leading-relaxed m-0">
            Zostałeś zaproszony do udziału w mediacji. Po utworzeniu konta, sprawa zostanie automatycznie przypisana do Twojego konta.
          </p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <FormInput
          id="firstName"
          name="firstName"
          type="text"
          label="Imię"
          placeholder="Twoje imię"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        
        <FormInput
          id="lastName"
          name="lastName"
          type="text"
          label="Nazwisko"
          placeholder="Twoje nazwisko"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        
        <FormInput
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="Twój adres email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <FormInput
          id="password"
          name="password"
          type="password"
          label="Hasło"
          placeholder="Minimum 8 znaków"
          value={formData.password}
          onChange={handleChange}
          required
          minLength={6}
        />
        
        <FormInput
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Potwierdź hasło"
          placeholder="Powtórz hasło"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        
        <div className="form-group">
          <label className="form-checkbox flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              required
              className="w-5 h-5 rounded-lg border-2 border-gray-300 text-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
            />
            <span className="text-gray-700 text-sm">
              Akceptuję <a href="#" className="text-blue-700 hover:text-blue-800 font-semibold">regulamin</a> i <a href="#" className="text-blue-700 hover:text-blue-800 font-semibold">politykę prywatności</a>
            </span>
          </label>
        </div>
        
        <SubmitButton
          loading={loading}
          loadingText="Rejestracja..."
          text="Zarejestruj się"
        />
      </form>
      
      <div className="divider-text"><span>lub</span></div>
      
      <TrustedProfileButton text="Zarejestruj przez Profil Zaufany" />
      
      <AuthFooter
        question="Masz już konto?"
        linkText="Zaloguj się"
        linkHref="/login"
      />
    </>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Ładowanie...</p>
      </div>
    }>
      <RegisterFormContent />
    </Suspense>
  );
}

