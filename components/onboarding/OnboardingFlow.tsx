'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import { OnboardingData, PersonalInfo, Preferences } from './types';
import ApiRequestLog from "@/components/logs/ApiRequestLog";
import {useApiLogs} from "@/hooks/useApiLogs";

interface OnboardingFlowProps {
    userId: string;
}

export default function OnboardingFlow({ userId }: OnboardingFlowProps) {
    const [step, setStep] = useState<number>(1);
    const [onboardingData, setOnboardingData] = useState<OnboardingData>({
        userId,
        personalInfo: {} as PersonalInfo,
        preferences: {} as Preferences,
        completed: false
    });
    const router = useRouter();
    const { logs, addLog, loading } = useApiLogs();


    const completeStep = (stepData: any) => {
        if (step === 1) {
            setOnboardingData(prev => ({
                ...prev,
                personalInfo: stepData as PersonalInfo
            }));
            setStep(2);
        } else if (step === 2) {
            setOnboardingData(prev => ({
                ...prev,
                preferences: stepData as Preferences
            }));
            setStep(3);
        } else if (step === 3) {
            setOnboardingData(prev => ({
                ...prev,
                completed: true,
                ...stepData
            }));
        }
    };

    const goBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-8">
            {/* Progress indicator */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    {[1, 2, 3].map((stepNumber) => (
                        <div key={stepNumber} className="flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                stepNumber === step ? 'bg-blue-600 text-white' :
                                    stepNumber < step ? 'bg-green-500 text-white' :
                                        'bg-gray-200 text-gray-700'
                            }`}>
                                {stepNumber < step ? '✓' : stepNumber}
                            </div>
                            <div className="text-sm mt-2 text-gray-600">
                                {stepNumber === 1 ? 'Index Your Code' :
                                    stepNumber === 2 ? 'Preferences' : 'Confirmation'}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="relative mt-2">
                    <div className="absolute top-0 h-1 w-full bg-gray-200"></div>
                    <div
                        className="absolute top-0 h-1 bg-blue-600 transition-all duration-300"
                        style={{ width: `${((step - 1) / 2) * 100}%` }}
                    ></div>
                </div>
            </div>

            {step === 1 && <Step1 onComplete={completeStep} />}
            {step === 2 && <Step2 onComplete={completeStep} onBack={goBack} />}
            {step === 3 && <Step3 onComplete={completeStep} onBack={goBack} />}

            <ApiRequestLog userId={userId} logs={logs} loading={loading} />

        </div>
    );
}