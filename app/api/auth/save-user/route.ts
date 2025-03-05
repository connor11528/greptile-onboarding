import {auth} from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import {saveUserToDatabase} from "@/utils/db";

import { WebhookEvent } from '@clerk/nextjs/server'

// todo: this is not being called... might have to listen for Clerk webhooks instead.
export async function GET(req: Request) {
    console.log('hit endpont! ')


    const { userId } = await auth()

    console.log({userId})
    if (!userId) {
        return new NextResponse("Unauthorized Clerk User ID")
    }

    try {
        await saveUserToDatabase({
            clerkId: userId,
        });

        return NextResponse.redirect(new URL('/onboarding', req.url));
    } catch (error) {
        console.error('Error saving user to database:', error);
        return NextResponse.redirect(new URL('/', req.url));
    }
}
