'use client';
import { StepIndicatorProps } from '@/lib/types';


export default function StepIndicator({ currentStep }: StepIndicatorProps) {
    const steps = [
        { number: 1, label: 'Informacje podstawowe'},
        { number: 2, label: 'Dokumenty'},
        { number: 3, label: 'Druga strona'},
        { number: 4, label: 'Podsumowanie'},
    ];

    const getStepStatus = (stepNumber: number) => {
        if (stepNumber < currentStep) return 'completed';
        if (stepNumber === currentStep && currentStep === steps.length) return 'completed';
        if (stepNumber === currentStep) return 'active';
        return 'pending';
      };

    return (
    <div className="relative px-2 sm:px-0">
        <div className="absolute top-6 sm:top-8 left-4 sm:left-6 right-4 sm:right-6 h-0.5 bg-linear-to-r from-gray-200 via-gray-200 to-gray-200 -z-10" />
        <div 
          className="absolute top-6 sm:top-8 left-4 sm:left-6 h-0.5 bg-linear-to-r from-green-500 to-[#0A2463] -z-10 transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />
        
        <div className="flex justify-between relative">
        {steps.map((step) => {
            const status = getStepStatus(step.number);
            
            return (
            <div
                key={step.number}
                className="flex flex-col items-center flex-1 min-w-0"
            >
                <div
                className={`
                    w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-semibold text-sm sm:text-base
                    transition-all duration-300 mb-2 sm:mb-3 shadow-md
                    ${
                    status === 'completed'
                        ? 'bg-linear-to-br from-green-500 to-green-600 text-white shadow-lg'
                        : status === 'active'
                        ? 'bg-linear-to-br from-[#0A2463] to-[#3E5C95] text-white ring-4 ring-[rgba(10,36,99,0.15)] shadow-lg scale-110'
                        : 'bg-white border-2 border-gray-300 text-gray-400'
                    }
                `}
                >
                {status === 'completed' ? (
                    <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                ) : (
                    step.number
                )}
                </div>
                <span
                className={`
                    text-sm sm:text-base font-medium text-center px-1
                    ${status === 'active' ? 'text-[#0A2463] font-semibold' : status === 'completed' ? 'text-green-600' : 'text-gray-400'}
                `}
                >
                <span className="hidden sm:inline">{step.label}</span>
                <span className="sm:hidden">{step.label.split(' ')[0]}</span>
                </span>
            </div>
            );
        })}
        </div>
    </div>
    );
}