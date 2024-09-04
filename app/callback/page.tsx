'use client'; // Mark as a client component

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { createUser, getUserById } from "../neo4j.action";

export default async function CallbackPage() {
    const { isAuthenticated, getUser } = getKindeServerSession();

    // Simplified redirect logic
    if (!(await isAuthenticated()) || !(await getUser())) {
        return redirect('/api/auth/login?post_login_redirect_url=http://localhost:3000/callback');
    }

    const user = await getUser();

    // Check if the user exists in Neo4j and create if necessary
    const dbUser = await getUserById(user.id);
    if (!dbUser) {
        await createUser({
            applicationId: user.id,
            email: user.email!,
            firstName: user.given_name!,
            lastName: user.family_name ?? undefined, 
        });
    }

    return redirect("/"); 
}