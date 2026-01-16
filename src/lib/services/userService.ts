import { prismaWithTimeout } from '@/lib/prisma';
import { UserWithProfile } from '@/lib/types/prisma';
import { sanitizeName } from '@/lib/utils/sanitize';
import { ProfileUpdateRequest } from '@/lib/api/types';

export async function getUserProfile(userId: string): Promise<UserWithProfile | null> {
  return await prismaWithTimeout(async (client) => {
    return client.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }, 30000);
}

export async function updateUserProfile(
  userId: string,
  data: ProfileUpdateRequest
): Promise<UserWithProfile> {

  const sanitizedFirstName = sanitizeName(data.firstName.trim());
  const sanitizedLastName = sanitizeName(data.lastName.trim());

  return await prismaWithTimeout(async (client) => {
    return client.user.update({
      where: { id: userId },
      data: {
        firstName: sanitizedFirstName,
        lastName: sanitizedLastName,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }, 30000);
}

export async function findUserByEmail(email: string) {
  return await prismaWithTimeout(async (client) => {
    return client.user.findUnique({
      where: { email },
    });
  }, 30000);
}
