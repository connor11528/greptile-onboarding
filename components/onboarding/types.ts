export interface OnboardingData {
    userId: string;
    personalInfo: PersonalInfo;
    preferences: Preferences;
    completed: boolean;
    setupCompleted?: boolean;
}

export interface PersonalInfo {
    fullName: string;
    jobTitle: string;
    company?: string;
}

export interface Preferences {
    usageType: 'personal' | 'work' | 'both' | '';
    team: boolean;
    notifications: boolean;
}

export interface StepProps {
    onComplete: (data: any) => void;
    onBack?: () => void;
}