'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Card,
  CardHeader,
  CardTitle,
  CardContent, 
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Neo4JUser } from '@/types'; 
import { createUser, deleteUser, updateUser } from '../neo4j.action';
import Link from 'next/link';

const UserProfile: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<Neo4JUser | null>(null);
  const [formData, setFormData] = useState<Neo4JUser>({
    applicationId: '',
    email: '',
    firstName: '',
    lastName: '',
    profilePictureUrl: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const response = await fetch('/api/user');

        if (response.ok) {
          const userData: Neo4JUser = await response.json();
          setUser(userData);
          setFormData(userData);
        } else {
          const errorData = await response.json();
          setErrorMessage(errorData.message || 'Error fetching user');
        }
      } catch (error) {
        setErrorMessage('Error fetching user');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const updatedUserData = { ...formData };
      if (user) {
        await updateUser(updatedUserData);
      } else {
        await createUser(updatedUserData);
      }

      setSuccessMessage('Profile updated successfully!');
      setFormData(updatedUserData);
      setUser(updatedUserData);
    } catch (error: any) {
      setErrorMessage(error.message || 'Error updating profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!user || !confirm('Are you sure you want to delete your profile?')) {
      return; 
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await deleteUser(user.applicationId);
      setUser(null);
      setFormData({
        applicationId: '',
        email: '',
        firstName: '',
        lastName: '',
        profilePictureUrl: '',
      });
      setSuccessMessage('Profile deleted successfully.');
      router.push('/'); 
    } catch (error: any) {
      setErrorMessage(error.message || 'Error deleting profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="bg-background min-h-screen px-4 py-10"> 

      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">User Profile Settings</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6"> 
          {/* Profile Picture Section (Removed) */}

          {/* Loading, Error, and Success Messages */}
          {isLoading && <p>Loading...</p>}
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          {successMessage && <p className="text-green-500">{successMessage}</p>}

          {/* Form for User Details */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="firstName" className="block text-sm font-medium leading-6 text-gray-900">
                  First Name
                </Label>
                <Input 
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="mt-2" 
                />
              </div>

              <div>
                <Label htmlFor="lastName" className="block text-sm font-medium leading-6 text-gray-900">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="mt-2" 
                />
              </div>

              <div>
                <Label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                  Email
                </Label>
                <Input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-2" 
                />
              </div>
            </div> 

            <CardFooter className="flex justify-end space-x-4 mt-6"> 
          {/* Go Home Button */}
          <Link href="/"> 
            <Button className="bg-gray-500 hover:bg-gray-600 text-white">
              Go Home
            </Button>
          </Link>

          <Button
            type="button"
            onClick={handleDelete} 
            className="bg-red-500 hover:bg-red-600 text-white" 
            disabled={isLoading || !user}
          >
            {isLoading ? 'Deleting...' : 'Delete Profile'}
          </Button>

          <Button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white" 
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardFooter>
          </form>
        </CardContent>
      </Card>
    </main>
  );
};

export default UserProfile;