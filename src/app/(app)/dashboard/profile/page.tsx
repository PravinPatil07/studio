
// src/app/(app)/dashboard/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import { UserProfileDisplay } from "@/components/dashboard/user-profile-display";
import { PageHeader } from "@/components/layout/page-header";
import type { User as AppUserType } from "@/types";
import { UserCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth-client";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<AppUserType | null>(null);
  const { user: firebaseUser, isLoading: authIsLoading } = useAuth();

  useEffect(() => {
    if (!authIsLoading && firebaseUser) {
      // Using Firebase user's email and UID. Other details are mock for this demo.
      // In a real app, you'd fetch these additional details from your database (e.g., Firestore)
      // using firebaseUser.uid as the key.
      const mockUserDetails: Omit<AppUserType, 'id' | 'email'> = {
        firstName: firebaseUser.displayName?.split(' ')[0] || "Donor", // Attempt to get from Firebase, or default
        lastName: firebaseUser.displayName?.split(' ')[1] || "User", // Attempt to get from Firebase, or default
        bloodGroup: "O+", 
        age: 30, 
        dateOfBirth: new Date(1994, 5, 15).toISOString(),
        address: "123 Life Saver St, Donation City, DC 12345",
        contactNumber: "+1 555-0101",
        donationHistory: [
          { id: "d1", donorId: firebaseUser.uid, dateOfDonation: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), quantity: "1 unit" },
        ]
      };
      
      setProfileData({
        id: firebaseUser.uid,
        email: firebaseUser.email || "No email provided",
        ...mockUserDetails,
      });
    } else if (!authIsLoading && !firebaseUser) {
      setProfileData(null); 
    }
  }, [firebaseUser, authIsLoading]);

  if (authIsLoading || (firebaseUser && !profileData)) {
    // Show skeleton loaders while auth is loading or profile data is being composed
    return (
      <div>
        <PageHeader 
          title="Your Profile" 
          description="View and manage your personal information and donation history."
          icon={UserCircle} 
        />
        <Card className="max-w-2xl mx-auto shadow-xl">
          <CardHeader className="text-center">
            <Skeleton className="h-24 w-24 rounded-full mx-auto mb-4 bg-muted" />
            <Skeleton className="h-8 w-48 mx-auto mb-2 bg-muted" />
            <Skeleton className="h-6 w-32 mx-auto bg-muted" />
          </CardHeader>
          <CardContent className="space-y-5 p-6 sm:p-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3">
                <Skeleton className="h-5 w-5 rounded bg-muted mt-1 shrink-0" />
                <div className="w-full">
                  <Skeleton className="h-4 w-1/4 mb-1 bg-muted" />
                  <Skeleton className="h-5 w-3/4 bg-muted" />
                </div>
              </div>
            ))}
             <div className="pt-4 border-t">
                <Skeleton className="h-6 w-40 mb-3 bg-muted" />
                <Skeleton className="h-5 w-full mb-1 bg-muted" />
                <Skeleton className="h-5 w-5/6 bg-muted" />
             </div>
             <div className="pt-6 text-center">
                <Skeleton className="h-10 w-36 bg-muted" />
             </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader 
        title="Your Profile" 
        description="View and manage your personal information and donation history."
        icon={UserCircle} 
      />
      <UserProfileDisplay user={profileData} />
    </div>
  );
}

// Dummy Card and other components used by Skeleton in ProfilePage for completeness of thought
// These are not actual UI changes needed for UserProfileDisplay component itself here.
const Card = ({className, children}: {className?: string, children: React.ReactNode}) => <div className={className}>{children}</div>;
const CardHeader = ({className, children}: {className?: string, children: React.ReactNode}) => <div className={className}>{children}</div>;
const CardContent = ({className, children}: {className?: string, children: React.ReactNode}) => <div className={className}>{children}</div>;
