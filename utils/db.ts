import {prisma} from "@/lib/prisma";

export async function saveUserToDatabase(userData: {
    clerkId: string;
}) {
    const existingUser = await prisma.user.findUnique({
        where: { clerk_id: userData.clerkId }
    });

    if (existingUser) {
        console.log('User already exists in database');
        return existingUser;
    }

    return prisma.user.create({
        data: {
            clerk_id: userData.clerkId,
        }
    });
}