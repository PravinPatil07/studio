// src/app/(app)/dashboard/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import { UserProfileDisplay } from "@/components/dashboard/user-profile-display";
import { PageHeader } from "@/components/layout/page-header";
import type { User } from "@/types";
import { UserCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth-client";
import type { Metadata } from 'next';

// Cannot use Metadata directly in client components, parent layout or page.tsx should set it.
// For now, we'll skip dynamic metadata based on user on this page.

// export const metadata: Metadata = {
//   title: 'User Profile - LifeFlow',
//   description: 'View and manage your LifeFlow profile.',
// };


export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const { userEmail } = useAuth(); // Get email from auth context

  useEffect(() => {
    // Simulate fetching user data
    // In a real app, you'd fetch this based on authenticated user ID
    const mockUser: User = {
      id: "user123",
      firstName: "John",
      lastName: "Donor",
      email: userEmail || "john.donor@example.com", // Use email from auth or default
      bloodGroup: "O+",
      age: 30,
      dateOfBirth: new Date(1994, 5, 15).toISOString(),
      address: "123 Life Saver St, Donation City, DC 12345",
      contactNumber: "+1 555-0101",
      donationHistory: [
        { id: "d1", donorId: "user123", dateOfDonation: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), quantity: "1 unit" },
        { id: "d2", donorId: "user123", dateOfDonation: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(), quantity: "1 unit" },
      ]
    };
    
    const timer = setTimeout(() => {
      setUser(mockUser);
    }, 500);
    return () => clearTimeout(timer);
  }, [userEmail]);

  return (
    <div>
      <PageHeader 
        title="Your Profile" 
        description="View and manage your personal information and donation history."
        icon={UserCircle} 
      />
      <UserProfileDisplay user={user} />
    </div>
  );
}
