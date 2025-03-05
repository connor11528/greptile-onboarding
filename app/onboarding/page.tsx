import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server'
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';

export default async function OnboardingPage() {
    const user = await currentUser()

    console.log(user?.id)

    if (!user) {
        redirect('/onboarding');
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center py-8 px-4">
            <div className="w-full max-w-3xl mx-auto">
                <OnboardingFlow userId={String(user?.id)} />
            </div>
        </div>
    );
}