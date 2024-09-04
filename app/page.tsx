'use client'

import { redirect } from "next/navigation";
import HomePageClientComponent from '@/components/Home';
import { useState, useEffect } from 'react';

export default function Home() {
  const [currentUser, setCurrentUser] = useState<any | null>(null); 
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Make a request to a server-side function to get session and user data
        const response = await fetch('/api/user'); // Adjust the path if needed

        if (response.ok) {
          const userData = await response.json(); 
          setCurrentUser(userData);
        } else {
          // If not authenticated or error, redirect to login
          redirect('/api/auth/login?post_login_redirect_url=http://localhost:3000/');
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Handle error, maybe redirect to an error page
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser(); 
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Or a loading indicator component
  }

  return (
    <main>
      {currentUser ? (
        <HomePageClientComponent />
      ) : (
        // Redirect to login if currentUser is null
        redirect('/api/auth/login?post_login_redirect_url=http://localhost:3000/') 
      )}
    </main>
  );
}