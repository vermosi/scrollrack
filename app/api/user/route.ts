'use server';

import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { getUserById } from '@/app/neo4j.action'; // Adjust import path

export async function GET(request: Request) {
  try {
    const { isAuthenticated, getUser } = getKindeServerSession();

    if (await isAuthenticated()) {
      const user = await getUser();
      // Now fetch additional data from Neo4j
      const userData = await getUserById(user.id);

      console.log("Authenticated user with Neo4j data:", userData); // Debugging
      return new Response(JSON.stringify(userData), { status: 200 });
    } else {
      console.log("User not authenticated"); // Debugging
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}