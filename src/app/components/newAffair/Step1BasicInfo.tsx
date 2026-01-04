'use client';

import { useState } from 'react';
import { AffairFormData } from '@/lib/types';

interface Step1BasicInfoProps {
    formData: AffairFormData;
    updateFormData: (data: Partial<AffairFormData>) => void;
    onNext: () => void;
    onCancel: () => void;
}

export default function Step1BasicInfo({
  formData,
  updateFormData,
  onNext,
  onCancel,  
}: Step1BasicInfoProps) {
    const [errors, setErrors] = useState<Record<string, string>>({});
    
    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Tytuł sprawy jest wymagany';
        }
        if (!formData.category) {
        newErrors.category = 'Kategoria jest wymagana';
        }
        if (!formData.description.trim()) {
        newErrors.description = 'Opis sprawy jest wymagany';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onNext();
        }
    }

    return (
        <form onSubmit={handleSubmit}>
          <div className="mb-6 pb-4 border-b">
            <h2 className="text-2xl font-bold text-gray-900">Krok 1: Informacje o sprawie</h2>
          </div>
    
          {/* Podstawowe informacje */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <svg className="w-5 h-5 text-blue-700 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h3 className="text-lg font-semibold text-blue-700">Podstawowe informacje</h3>
            </div>
    
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tytuł sprawy *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => updateFormData({ title: e.target.value })}
                  className={`w-full px-4 py-2 border-[1.5px] rounded-xl focus:outline-none focus:border-[#0A2463] focus:ring-0 focus:shadow-[0_0_0_3px_rgba(10,36,99,0.25)] ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Np. Sprzedaż samochodu, Umowa o dzieło"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>
    
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategoria *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => updateFormData({ category: e.target.value })}
                  className={`w-full px-4 py-2 border-[1.5px] rounded-xl focus:outline-none focus:border-[#0A2463] focus:ring-0 focus:shadow-[0_0_0_3px_rgba(10,36,99,0.25)] ${
                    errors.category ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Wybierz kategorię</option>
                  <option value="business">Sprawy biznesowe</option>
                  <option value="contract">Umowy cywilnoprawne</option>
                  <option value="consumer">Sprawy konsumenckie</option>
                  <option value="employment">Sprawy pracownicze</option>
                  <option value="property">Sprawy majątkowe</option>
                  <option value="other">Inne</option>
                </select>
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
              </div>
            </div>
                <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                Opis sprawy *
                </label>
                <textarea
                value={formData.description}
                onChange={(e) => updateFormData({ description: e.target.value })}
                rows={5}
                className={`w-full px-4 py-2 border-[1.5px] rounded-xl focus:outline-none focus:border-[#0A2463] focus:ring-0 focus:shadow-[0_0_0_3px_rgba(10,36,99,0.25)] ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Opisz czego dotyczy sprawa, co jest przedmiotem sporu..."
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                <p className="text-sm text-gray-500 mt-1">
                Krótko opisz czego dotyczy sprawa. Szczegóły przedstawisz w kolejnych krokach.
                </p>
            </div>
            </div>

            {/* Terminy i wartość */}
            <div className="mb-8">
            <div className="flex items-center mb-4">
                <svg className="w-5 h-5 text-blue-700 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-lg font-semibold text-blue-700">Terminy i wartość</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data powstania sporu
                </label>
                <input
                    type="date"
                    value={formData.disputeDate}
                    onChange={(e) => updateFormData({ disputeDate: e.target.value })}
                    className="w-full px-4 py-2 border-[1.5px] border-gray-300 rounded-xl focus:outline-none focus:border-[#0A2463] focus:ring-0 focus:shadow-[0_0_0_3px_rgba(10,36,99,0.25)]"
                />
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Wartość przedmiotu sporu (PLN)
                </label>
                <input
                    type="number"
                    value={formData.disputeValue || ''}
                    onChange={(e) => updateFormData({ disputeValue: e.target.value ? parseFloat(e.target.value) : null })}
                    className="w-full px-4 py-2 border-[1.5px] border-gray-300 rounded-xl focus:outline-none focus:border-[#0A2463] focus:ring-0 focus:shadow-[0_0_0_3px_rgba(10,36,99,0.25)]"
                    placeholder="Np. 5000"
                />
                </div>
            </div>
                <div className="mb-4">
                <label className="flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    checked={formData.hasTimeLimit}
                    onChange={(e) => updateFormData({ hasTimeLimit: e.target.checked })}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">
                    Sprawa ma określony termin wymagający szybkiego rozwiązania
                </span>
                </label>
            </div>

            {formData.hasTimeLimit && (
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Termin do kiedy sprawa powinna być rozwiązana
                </label>
                <input
                    type="date"
                    value={formData.timeDeadline}
                    onChange={(e) => updateFormData({ timeDeadline: e.target.value })}
                    className="w-full px-4 py-2 border-[1.5px] border-gray-300 rounded-xl focus:outline-none focus:border-[#0A2463] focus:ring-0 focus:shadow-[0_0_0_3px_rgba(10,36,99,0.25)]"
                />
                <p className="text-sm text-gray-500 mt-1">
                    Wskazany termin pomoże w priorytetyzacji sprawy.
                </p>
                </div>
            )}
            </div>

            {/* Akcje */}
            <div className="flex justify-between pt-6 border-t">
            <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 border-2 border-blue-300 text-blue-700 rounded-full font-semibold hover:bg-blue-50 transition-colors"
            >
                Anuluj
            </button>
            <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-br from-[#0A2463] to-[#3E5C95] hover:shadow-lg hover:-translate-y-0.5 text-white rounded-full font-semibold transition-all duration-300"
            >
                Dalej: Dodaj dokumenty
            </button>
        </div>
    </form>
);
}