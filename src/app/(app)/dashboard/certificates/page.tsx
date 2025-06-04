// src/app/(app)/dashboard/certificates/page.tsx
"use client";

import { useState, useEffect } from "react";
import { CertificateCard } from "@/components/dashboard/certificate-card";
import { PageHeader } from "@/components/layout/page-header";
import type { Certificate } from "@/types";
import { Award, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const mockCertificates: Certificate[] = [
  { id: "cert1", userId: "user123", donationId: "don1", issueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), certificateUrl: "https://placehold.co/600x400.png?text=Certificate+1" },
  { id: "cert2", userId: "user123", donationId: "don2", issueDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), certificateUrl: "https://placehold.co/600x400.png?text=Certificate+2" },
  { id: "cert3", userId: "user123", donationId: "don3", issueDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(), certificateUrl: "https://placehold.co/600x400.png?text=Certificate+3" },
];

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setCertificates(mockCertificates);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

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
              <Skeleton className="aspect-[4/3] w-full rounded-md mb-2" />
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
            Your donation certificates will appear here after successful donations.
          </p>
        </div>
      )}
    </div>
  );
}
