// src/app/(app)/dashboard/certificates/page.tsx
"use client";

import { useState, useEffect } from "react";
import { CertificateCard } from "@/components/dashboard/certificate-card";
import { PageHeader } from "@/components/layout/page-header";
import type { Certificate } from "@/types";
import { Award, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth-client";

const initialMockCertificates: Certificate[] = [
  { id: "cert-mock1", userId: "user123", donationId: "don-mock1", issueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), certificateUrl: "https://placehold.co/600x400.png?text=Mock+Certificate+1" },
  { id: "cert-mock2", userId: "user123", donationId: "don-mock2", issueDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), certificateUrl: "https://placehold.co/600x400.png?text=Mock+Certificate+2" },
];

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user: firebaseUser, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) {
      setIsLoading(true);
      return;
    }

    setIsLoading(true);
    let allCertificates: Certificate[] = [];

    // Add initial mock certificates if no user or for demonstration
    // In a real app, you might only show user-specific certificates.
    if (!firebaseUser) {
        allCertificates = [...initialMockCertificates];
    } else {
        // If user is logged in, load their certificates from localStorage
        try {
            const storedCertsString = localStorage.getItem(`userCertificates_${firebaseUser.uid}`);
            if (storedCertsString) {
                const storedCerts: Certificate[] = JSON.parse(storedCertsString);
                // Filter out any potential duplicates if mock data had same IDs
                // For now, just add them; ensure unique IDs in generation.
                allCertificates = [...storedCerts];
            }
        } catch (e) {
            console.error("Error loading certificates from localStorage:", e);
        }
    }
    
    // Simulate some loading time even if data comes from localStorage
    const timer = setTimeout(() => {
      // Sort by issue date, newest first
      allCertificates.sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());
      setCertificates(allCertificates);
      setIsLoading(false);
    }, 500); // Shorter delay as localStorage is fast

    return () => clearTimeout(timer);
  }, [firebaseUser, authLoading]);

  return (
    <div>
      <PageHeader 
        title="Your Certificates" 
        description="View and download your blood donation certificates."
        icon={Award} 
      />
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="p-6 border rounded-lg shadow-sm bg-card">
              <div className="flex items-center space-x-3 mb-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div>
                  <Skeleton className="h-6 w-40 mb-1" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
              <Skeleton className="aspect-[4/3] w-full rounded-md mb-2" data-ai-hint="certificate document" />
              <Skeleton className="h-4 w-24 mx-auto mb-4" />
              <div className="flex gap-2">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 flex-1" />
              </div>
            </div>
          ))}
        </div>
      ) : certificates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((certificate) => (
            <CertificateCard key={certificate.id} certificate={certificate} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 border-2 border-dashed border-muted-foreground/30 rounded-lg bg-card">
          <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground/70 mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No Certificates Yet</h3>
          <p className="text-muted-foreground">
            {firebaseUser ? "Your generated donation certificates will appear here." : "Log in to see your certificates."}
          </p>
        </div>
      )}
    </div>
  );
}
