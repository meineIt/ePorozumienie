'use client';

import { FormEvent } from 'react';

interface DiscountFormProps {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

const DiscountForm = ({ onSubmit }: DiscountFormProps) => {
  return (
    <>
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Odbierz zniżkę!</h3>
        <p className="text-gray-600">Zapisz się, aby otrzymać 30% zniżki na pierwszą mediację</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Imię
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#0A2463] hover:bg-[#051740] text-white py-3 px-6 rounded-lg font-semibold transition duration-300"
        >
          Zapisz
        </button>
      </form>

      <footer className="mt-4 text-center text-sm text-gray-500">
        <p>
          Zapisując się, wyrażasz zgodę na przetwarzanie danych osobowych (imię, email) przez
          e-Porozumienie w celu wysyłki kodów rabatowych.
        </p>
      </footer>
    </>
  );
};

export default DiscountForm;

