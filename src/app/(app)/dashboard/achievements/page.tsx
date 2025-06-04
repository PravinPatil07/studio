
// src/app/(app)/dashboard/achievements/page.tsx
"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Trophy, Activity, CalendarClock, Clock, Gift, Award as BadgeAwardIcon, Star, ShieldCheck, Heart, AlertTriangle, CheckCircle, Lightbulb } from "lucide-react";
import { useAuth } from "@/hooks/use-auth-client";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import type { User as AppUserType, ProfileDonationEntry, BadgeName } from "@/types";
import { DONATION_BADGES } from "@/types";
import { donationScheduleGuidance, type DonationScheduleGuidanceInput, type DonationScheduleGuidanceOutput } from "@/ai/flows/donation-schedule-guidance";
import { format, differenceInDays, isValid } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const BadgeIcon: React.FC<{ badgeName: BadgeName, className?: string }> = ({ badgeName, className }) => {
  switch (badgeName) {
    case DONATION_BADGES.FIRST_BLOOD_DROP:
      return <BadgeAwardIcon className={className} />;
    case DONATION_BADGES.HELPING_HAND:
      return <Star className={className} />;
    case DONATION_BADGES.LIFE_GUARDIAN:
      return <ShieldCheck className={className} />;
    case DONATION_BADGES.COMMUNITY_HERO:
      return <Heart className={className} />;
    default:
      return <Gift className={className} />;
  }
};

export default function AchievementsPage() {
  const { user: firebaseUser, isLoading: authLoading } = useAuth();
  const [profileData, setProfileData] = useState<AppUserType | null>(null);
  const [guidance, setGuidance] = useState<DonationScheduleGuidanceOutput | null>(null);
  const [nextDonationInDays, setNextDonationInDays] = useState<number | null>(null);
  
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingGuidance, setIsLoadingGuidance] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [guidanceError, setGuidanceError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || !firebaseUser) {
      setIsLoadingProfile(false);
      return;
    }

    const fetchProfile = async () => {
      setIsLoadingProfile(true);
      setProfileError(null);
      try {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const data = userDocSnap.data() as AppUserType;
          setProfileData({
            ...data,
            donationCount: data.donationCount || 0,
            badges: data.badges || [],
            donationHistory: data.donationHistory || [],
          });
        } else {
          setProfileError("Profile not found. Please complete your profile.");
          // Set a minimal profile to avoid errors with guidance call if possible
          setProfileData({
            id: firebaseUser.uid,
            email: firebaseUser.email || "",
            firstName: firebaseUser.displayName?.split(' ')[0] || "User",
            lastName: firebaseUser.displayName?.split(' ')[1] || "",
            bloodGroup: "N/A",
            age: 0,
            dateOfBirth: new Date().toISOString(),
            address: "",
            contactNumber: "",
            donationHistory: [],
            donationCount: 0,
            badges: [],
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setProfileError("Could not load profile details.");
      } finally {
        setIsLoadingProfile(false);
      }
    };
    fetchProfile();
  }, [firebaseUser, authLoading]);

  useEffect(() => {
    if (profileData && firebaseUser && profileData.bloodGroup && profileData.bloodGroup !== "N/A") {
      const fetchGuidance = async () => {
        setIsLoadingGuidance(true);
        setGuidanceError(null);
        setNextDonationInDays(null);
        try {
          const input: DonationScheduleGuidanceInput = {
            userId: firebaseUser.uid,
            donationHistory: profileData.donationHistory.map(h => ({ date: h.date, amount: "1 unit" })), // Assuming 1 unit for now
            bloodType: profileData.bloodGroup,
            healthConsiderations: profileData.healthConsiderations || "None", // Assuming healthConsiderations might be on profile
          };
          const result = await donationScheduleGuidance(input);
          setGuidance(result);
          if (result.nextDonationDate && isValid(new Date(result.nextDonationDate))) {
            const days = differenceInDays(new Date(result.nextDonationDate), new Date());
            setNextDonationInDays(days >= 0 ? days : 0); // Show 0 if date is past
          }
        } catch (e) {
          console.error("Error fetching AI guidance:", e);
          setGuidanceError("Could not fetch next donation estimate.");
        } finally {
          setIsLoadingGuidance(false);
        }
      };
      fetchGuidance();
    } else if (profileData && (profileData.bloodGroup === "N/A" || !profileData.bloodGroup)) {
        setGuidanceError("Please set your blood group in your profile to get next donation estimates.");
        setIsLoadingGuidance(false);
    }
  }, [profileData, firebaseUser]);

  const lastDonation = profileData?.donationHistory && profileData.donationHistory.length > 0 
    ? [...profileData.donationHistory].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
    : null;

  if (authLoading || isLoadingProfile) {
    return (
      <div>
        <PageHeader title="Achievements" icon={Trophy} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <Skeleton key={i} className="h-40 rounded-lg" />)}
        </div>
        <Skeleton className="h-60 rounded-lg mt-6" />
      </div>
    );
  }

  if (profileError && !profileData?.id) { // Only show critical profile error if no profile data at all
    return (
       <div>
        <PageHeader title="Achievements" icon={Trophy} />
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{profileError} <Link href="/dashboard/profile" className="underline">Go to Profile</Link></AlertDescription>
        </Alert>
      </div>
    );
  }
  
  if (!firebaseUser) {
     return (
       <div>
        <PageHeader title="Achievements" icon={Trophy} />
        <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Not Logged In</AlertTitle>
            <AlertDescription>Please log in to view your achievements.</AlertDescription>
        </Alert>
       </div>
     )
  }


  return (
    <div>
      <PageHeader title="Your Achievements" description="Track your donation milestones and impact." icon={Trophy} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">Next Donation Available In</CardTitle>
            <Clock className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingGuidance ? (
              <Skeleton className="h-8 w-1/2" />
            ) : guidanceError ? (
              <div className="text-xs text-destructive flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1" /> 
                {guidanceError}
                {guidanceError.includes("blood group") && <Button variant="link" size="sm" asChild className="p-0 ml-1 h-auto"><Link href="/dashboard/profile">Update Profile</Link></Button>}
              </div>
            ) : nextDonationInDays !== null ? (
              <div className="text-2xl font-bold text-accent">{nextDonationInDays} days</div>
            ) : (
              <div className="text-sm text-muted-foreground">Calculating...</div>
            )}
            {guidance && !guidanceError && <p className="text-xs text-muted-foreground pt-1">Based on AI guidance. ({format(new Date(guidance.nextDonationDate), "PPP")})</p>}
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">Total Donations</CardTitle>
            <Activity className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{profileData?.donationCount ?? 0}</div>
            <p className="text-xs text-muted-foreground">
              {profileData?.donationCount === 1 ? "time contributed" : "times contributed"}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">Last Donated</CardTitle>
            <CalendarClock className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              {lastDonation ? format(new Date(lastDonation.date), "dd/MM/yyyy") : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">
              {lastDonation ? "Keep up the great work!" : "Make your first donation!"}
            </p>
          </CardContent>
        </Card>
      </div>
      
      {profileError && profileData?.id && ( // Show non-critical profile error if some profile data exists
         <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Profile Data Issue</AlertTitle>
          <AlertDescription>{profileError} Some features might be limited. <Link href="/dashboard/profile" className="underline">Update Profile</Link></AlertDescription>
        </Alert>
      )}

      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex items-center space-x-2">
             <BadgeAwardIcon className="h-6 w-6 text-primary" />
            <CardTitle className="font-headline text-2xl text-primary">Earned Badges</CardTitle>
          </div>
          <CardDescription>Milestones you've achieved as a donor.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingProfile ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {[1,2,3,4].map(i => <Skeleton key={i} className="h-24 rounded-md" />)}
            </div>
          ) : profileData && profileData.badges && profileData.badges.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {profileData.badges.map((badgeName) => (
                <div key={badgeName} className="flex flex-col items-center p-4 border rounded-lg bg-card hover:shadow-md transition-shadow">
                  <BadgeIcon badgeName={badgeName as BadgeName} className="h-12 w-12 text-accent mb-2" />
                  <p className="text-sm font-medium text-center text-foreground">{badgeName}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border-2 border-dashed border-muted-foreground/30 rounded-lg bg-background">
              <Gift className="mx-auto h-12 w-12 text-muted-foreground/70 mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-1">No Badges Yet</h3>
              <p className="text-muted-foreground text-sm">Start donating to earn your first badge!</p>
            </div>
          )}
        </CardContent>
      </Card>
       <Card className="mt-8 shadow-xl">
        <CardHeader>
            <div className="flex items-center space-x-2">
                <Lightbulb className="h-6 w-6 text-primary"/>
                <CardTitle className="font-headline text-2xl text-primary">Did You Know?</CardTitle>
            </div>
        </CardHeader>
        <CardContent className="text-foreground/90">
            <p>Every single blood donation can help save up to three lives. Your contribution makes a significant impact on patients in need, including accident victims, surgery patients, and those with chronic illnesses.</p>
            <p className="mt-2">Regular donation also helps in maintaining good health by reducing harmful iron stores and stimulating the production of new blood cells.</p>
        </CardContent>
       </Card>


    </div>
  );
}

