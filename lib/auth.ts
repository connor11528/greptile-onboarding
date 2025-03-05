import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export type User = {
    id: string;
    clerkId: string;

}

export async function getCurrentUser(): Promise<any> {
    const { userId: clerkId } = await auth();
    if (!clerkId) throw new Error('Unauthorized');

    const user = await prisma.user.findFirst({
        where: { clerk_id: clerkId },
    });

    if (!user) throw new Error('Unauthorized');

    return user;
}