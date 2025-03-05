import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import {getCurrentUser} from "@/lib/auth";

export async function POST(req: Request) {

    try {
        const user = await getCurrentUser();

        console.log({userId: user})
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { remote, repository, branch } = body;

        if (!remote || !repository || !branch) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        console.log('Getting log entry....')

        const endpoint = 'https://api.greptile.com/v2/repositories';

        const logEntry = await prisma.logRequest.create({
            data: {
                user_id: user.id,
                endpoint: endpoint,
                request_body: JSON.stringify(body),
                status_code: 202,
            }
        });

        console.log({logEntry})

        const greptileResponse = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.GREPTILE_API_KEY}`
            },
            body: JSON.stringify({
                remote,
                repository,
                branch
            })
        });

        const greptileData = await greptileResponse.json();

        // Update log with response
        const newLog = await prisma.logRequest.update({
            where: { id: logEntry.id },
            data: {
                response: JSON.stringify(greptileData),
                status_code: greptileResponse.status
            }
        });

        // Return response to client
        return NextResponse.json({...greptileData, newLog}, { status: greptileResponse.status });
    } catch (error: any) {
        console.error('Error in Greptile index API:', error);
        return NextResponse.json({
            error: 'Failed to process request',
            message: error.message
        }, { status: 500 });
    }
}