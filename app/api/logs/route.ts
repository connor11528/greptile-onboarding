import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import {getCurrentUser} from "@/lib/auth";

export async function GET(request: Request) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ error: 'Forbidden', message: 'Access denied' })
        }

        const logs = await prisma.logRequest.findMany({
            where: {
                user_id: user.id
            },
            orderBy: {
                created_at: 'desc'
            }
        });

        return NextResponse.json(logs);
    } catch (error) {
        console.error('Error fetching logs:', error);
        return NextResponse.json({ error: 'Failed to fetch logs' });
    }
}