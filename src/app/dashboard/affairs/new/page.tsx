'use client';

import { useState } from "react";
import { useRouter } from 'next/navigation';
import StepIndicator from '@/app/components/newAffair/StepIndicator';
import Step1BasicInfo from '@/app/components/newAffair/Step1BasicInfo';
import Step2Documents from '@/app/components/newAffair/Step2Documents';
import Step3OtherParty from '@/app/components/newAffair/Step3OtherParty';
import Step4Summary from '@/app/components/newAffair/Step4Summary';
import { User, AffairFormData } from '@/lib/types';

export default function NewAffairPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    
    // Initialize user from localStorage using lazy initialization
    const [user] = useState<User | null>(() => {
        if (typeof window !== 'undefined') {
            const userData = localStorage.getItem('user');
            if (userData) {
                try {
                    const parsedUser = JSON.parse(userData) as User;
                    // Validate user data
                    if (parsedUser && parsedUser.email && parsedUser.firstName && parsedUser.lastName) {
                        return parsedUser;
                    }
                } catch (error) {
                    console.error('Error parsing user data:', error);
                }
            }
        }
        return null;
    });
    
    const [formData, setFormData] = useState<AffairFormData>({
        title: '',
        category: '',
        description: '',
        disputeDate: '',
        disputeValue: null,
        hasTimeLimit: false,
        timeDeadline: '',
        documents: [],
        otherPartyType: 'person',
        knowsOtherParty: true,
        customMessage: '',
        notifyEmail: true,
        notifySMS: false,
    });

    const updateFormData = (data: Partial<AffairFormData>) => {
        setFormData(prev => ({ ...prev, ...data}));
    };

    const nextStep = () => {
        if (currentStep < 4) {
            setCurrentStep(currentStep + 1);
        };
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        };
    };

    const goToStep = (step: number) => {
        if (step >= 1 && step <4) {
            setCurrentStep(step);
        };
    };

    if (!user) {
        return null;
    }
    
    return (
        <div className="min-h-screen bg-[#F5F5F7] pt-[70px] lg:pl-[240px]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
              
              <StepIndicator 
                currentStep={currentStep}
              />
    
              <div className="bg-white rounded-lg shadow-md p-8 mt-8">
                {currentStep === 1 && (
                  <Step1BasicInfo
                    formData={formData}
                    updateFormData={updateFormData}
                    onNext={nextStep}
                    onCancel={() => router.push('/dashboard')}
                  />
                )}
                
                {currentStep === 2 && (
                  <Step2Documents
                    formData={formData}
                    updateFormData={updateFormData}
                    onNext={nextStep}
                    onPrev={prevStep}
                  />
                )}
                
                {currentStep === 3 && (
                  <Step3OtherParty
                    formData={formData}
                    updateFormData={updateFormData}
                    onNext={nextStep}
                    onPrev={prevStep}
                  />
                )}
                
                {currentStep === 4 && (
                  <Step4Summary
                    formData={formData}
                    user={user}
                    onPrev={prevStep}
                    onCreateAffair={() => {
                      // TODO: Implementacja zapisu sprawy
                      console.log('Creating affair:', formData);
                    }}
                  />
                )}
              </div>
            </div>
          </div>
      );
    }