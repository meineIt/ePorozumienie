'use client';

import { useState, FormEvent, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import '@/styles/auth.css';
import AuthSidebar from '../components/auth/AuthSidebar';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  
  // Sprawdź czy użytkownik został zarejestrowany
  const isRegistered = useMemo(() => {
    return searchParams.get('registered') === 'true';
  }, [searchParams]);
  
  const [success, setSuccess] = useState(() => searchParams.get('registered') === 'true');
  
  useEffect(() => {
    if (isRegistered) {
      // Hide success message after 5 seconds
      const timer = setTimeout(() => {
        setSuccess(false);
      }, 5000);
      
      // Cleanup function - wyczyści timeout jeśli komponent się odmontuje
      return () => clearTimeout(timer);
    }
  }, [isRegistered]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    setError(false);
    setLoading(true);

    try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });
    
        const data = await response.json();
    
        if (!response.ok) {
          setError(true);
          setLoading(false);
          setShake(true);
          setTimeout(() => {
            setShake(false);
          }, 500);
          return;
        }
    
        // Sukces - zapisz dane użytkownika (opcjonalnie w localStorage)
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
    
        // Przekieruj do dashboardu
        router.push('/dashboard');
      } catch {
        setError(true);
        setLoading(false);
        setShake(true);
        setTimeout(() => {
          setShake(false);
        }, 500);
      }
  };

  return (
    <main className="login-page">
      <div className={`login-container fade-in ${shake ? 'shake' : ''}`}>
        <AuthSidebar />
        
        <div className="login-form-container fade-in-delay-1">
          <div className="login-form-header">
            <h1>Witaj ponownie</h1>
            <p>Zaloguj się, aby kontynuować korzystanie z platformy.</p>
          </div>
          
          {success && (
            <div className="success-message">
              Rejestracja zakończona pomyślnie! Możesz się teraz zalogować.
            </div>
          )}
          
          {error && (
            <div className="error-message">
              Nieprawidłowy email lub hasło. Spróbuj ponownie.
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="Twój adres email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password" className="form-label">Hasło</label>
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="Twoje hasło"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="form-helper">
              <label className="form-checkbox">
                <input
                  type="checkbox"
                  id="remember"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span>Zapamiętaj mnie</span>
              </label>
              
              <a href="#">Zapomniałeś hasła?</a>
            </div>
            
            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary login-btn"
                disabled={loading}
              >
                {loading && <span className="spinner"></span>}
                <span>{loading ? 'Logowanie...' : 'Zaloguj się'}</span>
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
            <span>Zaloguj przez Profil Zaufany</span>
          </button>
          
          <div className="login-footer">
            <p>Nie masz jeszcze konta? <Link href="/register">Zarejestruj się</Link></p>
          </div>
        </div>
      </div>
    </main>
  );
}

