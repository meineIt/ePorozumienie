'use client';

import { useState, useEffect, FormEvent, useImperativeHandle, forwardRef } from 'react';
import DiscountForm from './DiscountForm';
import { PopupModalRef } from '@/lib/types';


const PopupModal = forwardRef<PopupModalRef>((_, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => {
      setIsOpen(true);
      setHasShown(true);
    },
  }));

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasShown) {
        setIsOpen(true);
        setHasShown(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [hasShown]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;

    try {
      const response = await fetch('/api/discount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Sukces - zamknij popup
        handleClose();
        // Opcjonalnie: pokaż komunikat sukcesu
        alert('Dziękujemy! Sprawdź swoją skrzynkę email, aby otrzymać kod rabatowy.');
      } else {
        // Błąd
        alert(data.error || 'Wystąpił błąd podczas zapisywania. Spróbuj ponownie.');
      }
    } catch (error) {
      console.error('Error submitting discount form:', error);
      alert('Wystąpił błąd podczas wysyłania formularza. Spróbuj ponownie.');
    }
  };

  return (
    <div
      className={`popup-overlay ${isOpen ? 'active' : ''}`}
      onClick={handleOverlayClick}
    >
      <div className="popup-content relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition duration-300"
          aria-label="Zamknij"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        <DiscountForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
});

PopupModal.displayName = 'PopupModal';

export default PopupModal;

