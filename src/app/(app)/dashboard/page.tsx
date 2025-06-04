// src/app/(app)/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { DonationRequestCard } from "@/components/dashboard/donation-request-card";
import { PageHeader } from "@/components/layout/page-header";
import type { BloodRequest } from "@/types";
import { Home, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

const mockRequests: BloodRequest[] = [
  { id: "1", requesterName: "Alice Smith", bloodGroup: "A+", location: "Springfield, IL", dateNeeded: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), contactNumber: "555-1234", isFulfilled: false, createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
  { id: "2", requesterName: "Bob Johnson", bloodGroup: "O-", location: "Shelbyville, IL", dateNeeded: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), contactNumber: "555-5678", isFulfilled: false, createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
  { id: "3", requesterName: "Carol Williams", bloodGroup: "B+", location: "Capital City, IL", dateNeeded: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), contactNumber: "555-9012", isFulfilled: true, createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
  { id: "4", requesterName: "David Brown", bloodGroup: "AB+", location: "Ogdenville, IL", dateNeeded: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), contactNumber: "555-3456", isFulfilled: false, createdAt: new Date().toISOString() },
];

export default function DashboardPage() {
  const { toast } = useToast();
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setRequests(mockRequests.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleDonate = (requestId: string) => {
    // Mock marking request as fulfilled and updating user stats
    setRequests(prevRequests =>
      prevRequests.map(req =>
        req.id === requestId ? { ...req, isFulfilled: true } : req
      )
    );
    toast({
      title: "Donation Marked!",
      description: `Thank you for your commitment to help fulfill request ID: ${requestId}.`,
      variant: "default",
    });
    // In a real app, this would also trigger an API call to update backend and user's donation stats.
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
            <DonationRequestCard key={request.id} request={request} onDonate={handleDonate} />
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
              <DonationRequestCard key={request.id} request={request} onDonate={handleDonate} />
            ))}
          </div>
        </>
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
      <div className="space-y-3 mb-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  );
}
