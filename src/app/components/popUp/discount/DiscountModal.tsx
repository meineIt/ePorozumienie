'use client';

import { useState, useEffect, FormEvent, useImperativeHandle, forwardRef } from 'react';
import DiscountForm from './DiscountForm';

export interface PopupModalRef {
  open: () => void;
}

const PopupModal = forwardRef<PopupModalRef>((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => {
      setIsOpen(true);
      setHasShown(true);
    },
  }));

  useEffect(() => {
    // Show popup after 2 seconds if it hasn't been shown yet
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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted');
    handleClose();
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

