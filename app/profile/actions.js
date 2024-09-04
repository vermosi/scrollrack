// app/profile/actions.ts (or a similar file in your app/profile directory)
'use server'; 

import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { getUserById } from '@/app/neo4j.action';

export async function fetchUserProfileData() {
  const { isAuthenticated, getUser } = getKindeServerSession();

  if (await isAuthenticated()) {
    const kindeUser = await getUser();
    if (kindeUser) {
      const userData = await getUserById(kindeUser.id);
      return userData; 
    }
  }
  throw new Error('User not authenticated');
}