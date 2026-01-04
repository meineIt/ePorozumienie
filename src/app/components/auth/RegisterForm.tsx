'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import FormInput from './FormInput';
import SubmitButton from './SubmitButton';
import TrustedProfileButton from './TrustedProfileButton';
import AuthFooter from './AuthFooter';
import ErrorMessage from './ErrorMessage';
import { useShake } from './hooks/useShake';

export default function RegisterPage() {
  const router = useRouter();
  const { triggerShake } = useShake();
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
    if (formData.password.length < 6) {
      setError('Hasło musi mieć co najmniej 6 znaków');
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
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        setError(data.error || 'Wystąpił błąd podczas rejestracji');
        setLoading(false);
        triggerShake();
        return;
      }
  
      // Sukces - przekieruj do logowania
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
          placeholder="Minimum 6 znaków"
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
          <label className="form-checkbox">
            <input
              type="checkbox"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              required
            />
            <span>Akceptuję <a href="#">regulamin</a> i <a href="#">politykę prywatności</a></span>
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

