import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { currentUser } from '@clerk/nextjs';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        // Security check - only allow users to view their own logs
        const user = await currentUser();

        if (!user || user.id !== userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const logs = await prisma.apiRequestLog.findMany({
            where: {
                userId: userId,
            },
            orderBy: {
                timestamp: 'desc',
            },
            take: 10, // Limit to the 10 most recent requests
        });

        return NextResponse.json(logs);
    } catch (error) {
        console.error('Error fetching logs:', error);
        return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
    }
}