'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '@/styles/auth.css';
import AuthSidebar from '../components/auth/AuthSidebar';

export default function RegisterPage() {
  const router = useRouter();
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
  const [shake, setShake] = useState(false);

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
      setShake(true);
      setTimeout(() => setShake(false), 500);
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
        setShake(true);
        setTimeout(() => setShake(false), 500);
        return;
      }
  
      // Sukces - przekieruj do logowania
      router.push('/login?registered=true');
    } catch (err) {
      setError('Wystąpił błąd połączenia. Spróbuj ponownie.');
      setLoading(false);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <main className="login-page">
      <div className={`login-container fade-in ${shake ? 'shake' : ''}`}>
        <AuthSidebar />
        
        <div className="login-form-container fade-in-delay-1">
          <div className="login-form-header">
            <h1>Utwórz konto</h1>
            <p>Zarejestruj się, aby rozpocząć korzystanie z platformy.</p>
          </div>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="firstName" className="form-label">Imię</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className="form-control"
                placeholder="Twoje imię"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="lastName" className="form-label">Nazwisko</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className="form-control"
                placeholder="Twoje nazwisko"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                placeholder="Twój adres email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password" className="form-label">Hasło</label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                placeholder="Minimum 6 znaków"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Potwierdź hasło</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="form-control"
                placeholder="Powtórz hasło"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            
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
            
            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary login-btn"
                disabled={loading}
              >
                {loading && <span className="spinner"></span>}
                <span>{loading ? 'Rejestracja...' : 'Zarejestruj się'}</span>
              </button>
            </div>
          </form>
          
          <div className="divider-text"><span>lub</span></div>
          
          <button className="btn btn-trusted-profile disabled" disabled>
            <span className="trusted-profile-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="M9 12l2 2 4-4"/>
              </svg>
            </span>
            <span>Zarejestruj przez Profil Zaufany</span>
          </button>
          
          <div className="login-footer">
            <p>Masz już konto? <Link href="/login">Zaloguj się</Link></p>
          </div>
        </div>
      </div>
    </main>
  );
}

