'use client';

interface StepIndicatorProps {
    currentStep: number;
    onStepClick?: (step: number) => void;
}

export default function StepIndicator({ currentStep, onStepClick }: StepIndicatorProps) {
    const steps = [
        { number: 1, label: 'Informacje podstawowe'},
        { number: 2, label: 'Dokumenty'},
        { number: 3, label: 'Druga strona'},
        { number: 4, label: 'Podsumowanie'},
    ];

    const getStepStatus = (stepNumber: number) => {
        if (stepNumber < currentStep) return 'completed';
        if (stepNumber === currentStep) return 'active';
        return 'pending';
      };

    return (
    <div className="relative">
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200 -z-10" />
        
        <div className="flex justify-between relative">
        {steps.map((step) => {
            const status = getStepStatus(step.number);
            const isClickable = onStepClick && status !== 'pending';
            
            return (
            <div
                key={step.number}
                className="flex flex-col items-center flex-1"
            >
                <button
                onClick={() => isClickable && onStepClick(step.number)}
                disabled={!isClickable}
                className={`
                    w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm
                    transition-all duration-300 mb-2
                    ${
                    status === 'completed'
                        ? 'bg-[#4CAF50] text-white'
                        : status === 'active'
                        ? 'bg-gradient-to-br from-[#0A2463] to-[#3E5C95] text-white ring-4 ring-[rgba(10,36,99,0.1)]'
                        : 'bg-white border-2 border-gray-300 text-gray-400'
                    }
                    ${isClickable ? 'cursor-pointer hover:scale-110' : 'cursor-not-allowed'}
                `}
                >
                {status === 'completed' ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                ) : (
                    step.number
                )}
                </button>
                <span
                className={`
                    text-sm font-medium text-center
                    ${status === 'active' ? 'text-[#0A2463]' : status === 'completed' ? 'text-[#4CAF50]' : 'text-gray-400'}
                `}
                >
                {step.label}
                </span>
            </div>
            );
        })}
        </div>
    </div>
    );
}