
// src/app/(app)/dashboard/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import { UserProfileDisplay } from "@/components/dashboard/user-profile-display";
import { PageHeader } from "@/components/layout/page-header";
import type { User as AppUserType } from "@/types";
import { UserCircle, AlertTriangle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth-client";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<AppUserType | null>(null);
  const { user: firebaseUser, isLoading: authIsLoading } = useAuth();
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    if (!authIsLoading && firebaseUser) {
      try {
        const storedProfileString = localStorage.getItem(`userProfile_${firebaseUser.uid}`);
        if (storedProfileString) {
          const storedProfile = JSON.parse(storedProfileString);
          setProfileData({
            id: firebaseUser.uid,
            email: firebaseUser.email || "No email provided", // From Firebase Auth
            firstName: storedProfile.firstName || firebaseUser.displayName?.split(' ')[0] || "User",
            lastName: storedProfile.lastName || firebaseUser.displayName?.split(' ')[1] || "",
            bloodGroup: storedProfile.bloodGroup || "N/A",
            age: storedProfile.age || 0,
            dateOfBirth: storedProfile.dateOfBirth || new Date().toISOString(), // Fallback, consider better one
            address: storedProfile.address || "No address provided",
            contactNumber: storedProfile.contactNumber || "No contact provided",
            donationHistory: storedProfile.donationHistory || [], // Assuming donation history might also be stored or fetched elsewhere
          });
        } else {
          // Fallback if no profile in localStorage (e.g., user signed up before this feature)
          // Or, user logged in via a method that didn't populate localStorage profile (e.g. social login if added later)
           setProfileData({
            id: firebaseUser.uid,
            email: firebaseUser.email || "No email provided",
            firstName: firebaseUser.displayName?.split(' ')[0] || "Donor",
            lastName: firebaseUser.displayName?.split(' ')[1] || "User",
            bloodGroup: "N/A",
            age: 0, // Consider removing or handling 'unknown' age
            dateOfBirth: new Date(1900,0,1).toISOString(), // Default to a very past date
            address: "Address not set",
            contactNumber: "Contact not set",
            donationHistory: []
          });
          setProfileError("Some profile details might be missing. Please consider re-saving your profile if this is your first time here after an update.");
        }
      } catch (error) {
        console.error("Error loading profile from localStorage:", error);
        setProfileError("Could not load all profile details. Displaying available information.");
        // Fallback to basic info from firebaseUser if localStorage fails catastrophically
        setProfileData({
          id: firebaseUser.uid,
          email: firebaseUser.email || "Error loading email",
          firstName: firebaseUser.displayName?.split(' ')[0] || "Error",
          lastName: firebaseUser.displayName?.split(' ')[1] || "Loading",
          bloodGroup: "Error",
          age: 0,
          dateOfBirth: new Date().toISOString(),
          address: "Error loading address",
          contactNumber: "Error loading contact",
          donationHistory: [],
        });
      }
    } else if (!authIsLoading && !firebaseUser) {
      setProfileData(null); 
      setProfileError(null);
    }
  }, [firebaseUser, authIsLoading]);

  if (authIsLoading || (firebaseUser && !profileData && !profileError)) {
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
  
  if (!firebaseUser && !authIsLoading) {
    // Should be redirected by AppLayout, but as a safeguard:
    return (
        <div className="text-center py-10">
            <p>Please log in to view your profile.</p>
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
      {profileError && (
         <div className="max-w-2xl mx-auto mb-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
            <div className="flex">
                <div className="py-1"><AlertTriangle className="h-5 w-5 text-yellow-500 mr-3" /></div>
                <div>
                    <p className="font-bold">Profile Notice</p>
                    <p className="text-sm">{profileError}</p>
                </div>
            </div>
        </div>
      )}
      <UserProfileDisplay user={profileData} />
    </div>
  );
}

// Dummy Card and other components used by Skeleton in ProfilePage for completeness of thought
const Card = ({className, children}: {className?: string, children: React.ReactNode}) => <div className={className}>{children}</div>;
const CardHeader = ({className, children}: {className?: string, children: React.ReactNode}) => <div className={className}>{children}</div>;
const CardContent = ({className, children}: {className?: string, children: React.ReactNode}) => <div className={className}>{children}</div>;

