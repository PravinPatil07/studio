
// src/app/(app)/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { DonationRequestCard } from "@/components/dashboard/donation-request-card";
import { PageHeader } from "@/components/layout/page-header";
import type { BloodRequest, Certificate, User as AppUserType, ProfileDonationEntry, BadgeName } from "@/types";
import { DONATION_BADGES, BADGE_THRESHOLDS } from "@/types";
import { Home, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth-client";
import { generateCertificate } from "@/ai/flows/generate-certificate-flow";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ConfirmDonationDialog, type ConfirmDonationFormValues } from "@/components/dashboard/ConfirmDonationDialog";

const mockRequests: BloodRequest[] = [
  { id: "req1", requesterName: "Aarav Sharma", bloodGroup: "A+", location: "Mumbai, MH", dateNeeded: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), contactNumber: "555-1234", urgency: "Urgent", isFulfilled: false, createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
  { id: "req2", requesterName: "Diya Patel", bloodGroup: "O-", location: "Delhi, DL", dateNeeded: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), contactNumber: "555-5678", urgency: "Moderate", isFulfilled: false, createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
  { id: "req3", requesterName: "Ishaan Reddy", bloodGroup: "B+", location: "Bangalore, KA", dateNeeded: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), contactNumber: "555-9012", urgency: "Low", isFulfilled: true, createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
  { id: "req4", requesterName: "Myra Singh", bloodGroup: "AB+", location: "Chennai, TN", dateNeeded: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), contactNumber: "555-3456", urgency: "Moderate", isFulfilled: false, createdAt: new Date().toISOString() },
];

export default function DashboardPage() {
  const { toast } = useToast();
  const { user: firebaseUser } = useAuth();
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isConfirmDonationDialogOpen, setIsConfirmDonationDialogOpen] = useState(false);
  const [currentRequestToFulfill, setCurrentRequestToFulfill] = useState<BloodRequest | null>(null);
  const [isProcessingDonation, setIsProcessingDonation] = useState(false);


  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setRequests(mockRequests.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const openDonationConfirmation = (request: BloodRequest) => {
    if (!firebaseUser) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to perform this action.",
        variant: "destructive",
      });
      return;
    }
    setCurrentRequestToFulfill(request);
    setIsConfirmDonationDialogOpen(true);
  };

  const processConfirmedDonation = async (formData: ConfirmDonationFormValues) => {
    if (!firebaseUser || !currentRequestToFulfill) {
      toast({ title: "Error", description: "User or request data missing.", variant: "destructive" });
      setIsProcessingDonation(false);
      setIsConfirmDonationDialogOpen(false);
      return;
    }

    setIsProcessingDonation(true);
    toast({
      title: "Processing Donation & Certificate...",
      description: "Please wait while your donation is recorded.",
    });

    const donationId = `donation-${currentRequestToFulfill.id}-${Date.now()}`;

    try {
      // 1. Update user profile in Firestore
      const userDocRef = doc(db, "users", firebaseUser.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data() as AppUserType;
        const currentDonationCount = userData.donationCount || 0;
        const newDonationCount = currentDonationCount + 1;
        
        let updatedBadges: BadgeName[] = [...(userData.badges || [])];
        (Object.keys(BADGE_THRESHOLDS) as BadgeName[]).forEach(badgeName => {
          if (newDonationCount >= BADGE_THRESHOLDS[badgeName] && !updatedBadges.includes(badgeName)) {
            updatedBadges.push(badgeName);
            toast({ title: "New Badge Earned!", description: `Congratulations, you've earned the "${badgeName}" badge!`});
          }
        });

        const newDonationEntry: ProfileDonationEntry = {
          date: formData.donationDate.toISOString(),
          fulfilledRequestId: currentRequestToFulfill.id,
          location: formData.donationLocation || undefined,
          notes: formData.notes || `Fulfilled request for ${currentRequestToFulfill.requesterName} (${currentRequestToFulfill.bloodGroup})`,
        };
        const updatedDonationHistory = [...(userData.donationHistory || []), newDonationEntry];

        await updateDoc(userDocRef, {
          donationCount: newDonationCount,
          donationHistory: updatedDonationHistory,
          badges: updatedBadges,
        });
        toast({ title: "Profile Updated", description: "Your donation count and badges have been updated." });
      } else {
        console.warn("User profile not found in Firestore for donation update.");
      }

      // 2. Generate Certificate
      const donorName = firebaseUser.displayName || firebaseUser.email || "Valued Donor";
      const issuingOrganization = "LifeFlow App Services";

      const certificateResult = await generateCertificate({
        donorName,
        donationDate: formData.donationDate.toISOString(),
        issuingOrganization,
        donationId,
      });

      const newCertificate: Certificate = {
        id: `cert-${donationId}`,
        userId: firebaseUser.uid,
        donationId: donationId,
        issueDate: formData.donationDate.toISOString(),
        certificateUrl: certificateResult.certificateDataUri,
      };

      // Store certificate in localStorage
      const existingCertsString = localStorage.getItem(`userCertificates_${firebaseUser.uid}`);
      const existingCerts: Certificate[] = existingCertsString ? JSON.parse(existingCertsString) : [];
      localStorage.setItem(`userCertificates_${firebaseUser.uid}`, JSON.stringify([...existingCerts, newCertificate]));

      toast({
        title: "Certificate Generated!",
        description: "Your donation certificate has been successfully created and saved.",
      });

      // Optimistically update UI for request fulfillment
      setRequests(prevRequests =>
        prevRequests.map(req =>
          req.id === currentRequestToFulfill!.id ? { ...req, isFulfilled: true } : req
        )
      );

    } catch (error) {
      console.error("Failed to process donation or generate certificate:", error);
      toast({
        title: "Error Processing Donation",
        description: `There was an issue. Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setIsProcessingDonation(false);
      setIsConfirmDonationDialogOpen(false);
      setCurrentRequestToFulfill(null);
    }
  };

  const pendingRequests = requests.filter(req => !req.isFulfilled);

  return (
    <div>
      <PageHeader title="Dashboard" description="View active blood donation requests." icon={Home} />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : pendingRequests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingRequests.map((request) => (
            <DonationRequestCard
              key={request.id}
              request={request}
              onDonate={() => openDonationConfirmation(request)}
              isGeneratingCert={isProcessingDonation && currentRequestToFulfill?.id === request.id}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 border-2 border-dashed border-muted-foreground/30 rounded-lg bg-card">
          <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground/70 mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No Active Requests</h3>
          <p className="text-muted-foreground mb-4">
            There are currently no pending blood donation requests.
          </p>
          <Button asChild variant="default" className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/dashboard/request-blood">
              Create a New Request
            </Link>
          </Button>
        </div>
      )}

      { !isLoading && requests.filter(req => req.isFulfilled).length > 0 && (
        <>
          <h2 className="text-2xl font-headline font-semibold text-primary mt-12 mb-6">Fulfilled Requests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.filter(req => req.isFulfilled).map((request) => (
              <DonationRequestCard
                key={request.id}
                request={request}
                onDonate={() => { /* Cannot re-donate fulfilled request */}}
                isGeneratingCert={false} // Or handle differently if re-generating is possible
              />
            ))}
          </div>
        </>
      )}
      {currentRequestToFulfill && (
        <ConfirmDonationDialog
          isOpen={isConfirmDonationDialogOpen}
          onClose={() => {
            setIsConfirmDonationDialogOpen(false);
            setCurrentRequestToFulfill(null);
          }}
          onSubmit={processConfirmedDonation}
          isProcessing={isProcessingDonation}
          initialLocation={currentRequestToFulfill.location}
          requesterName={currentRequestToFulfill.requesterName}
        />
      )}
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="p-6 border rounded-lg shadow-sm bg-card">
      <div className="flex justify-between items-start mb-2">
        <div>
          <Skeleton className="h-6 w-3/4 mb-1" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton className="h-6 w-20" />
      </div>
      <Skeleton className="h-5 w-24 mb-3" />
      <div className="space-y-3 mb-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  );
}
