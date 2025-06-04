// src/app/(app)/dashboard/find-donor/page.tsx
"use client";

import { useState, useEffect } from "react";
import { DonorCard } from "@/components/dashboard/donor-card";
import { DonorSearchForm } from "@/components/dashboard/donor-search-form";
import { PageHeader } from "@/components/layout/page-header";
import type { DonorSearchResult, BloodGroup } from "@/types";
import { Search, Users, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const mockDonors: DonorSearchResult[] = [
  { id: "d1", name: "Arjun Kumar", bloodGroup: "A+", city: "Mumbai", contactInfo: "Available", lastDonationDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString() },
  { id: "d2", name: "Sneha Reddy", bloodGroup: "O-", city: "Delhi", contactInfo: "Available", lastDonationDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString() },
  { id: "d3", name: "Mohan Gupta", bloodGroup: "B+", city: "Mumbai", contactInfo: "Available" },
  { id: "d4", name: "Lakshmi Iyer", bloodGroup: "AB+", city: "Bangalore", contactInfo: "Available", lastDonationDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() },
  { id: "d5", name: "Ravi Shankar", bloodGroup: "A-", city: "Mumbai", contactInfo: "Available", lastDonationDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString() },
];

interface SearchFilters {
  bloodGroup?: BloodGroup | "";
  city?: string;
}

export default function FindDonorPage() {
  const [donors, setDonors] = useState<DonorSearchResult[]>([]);
  const [filteredDonors, setFilteredDonors] = useState<DonorSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

 useEffect(() => {
    // Simulate API call to fetch initial set of donors
    const timer = setTimeout(() => {
      setDonors(mockDonors);
      setFilteredDonors(mockDonors); // Initially show all donors
      setIsLoading(false);
    }, 1000);
     return () => clearTimeout(timer);
  }, []);


  const handleSearch = (filters: SearchFilters) => {
    setIsLoading(true);
    // Simulate filtering
    setTimeout(() => {
      let result = mockDonors;
      if (filters.bloodGroup) {
        result = result.filter(donor => donor.bloodGroup === filters.bloodGroup);
      }
      if (filters.city) {
        result = result.filter(donor => donor.city.toLowerCase().includes(filters.city!.toLowerCase()));
      }
      setFilteredDonors(result);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div>
      <PageHeader 
        title="Find a Donor" 
        description="Search for potential blood donors by blood group and location. (Results are mock data)"
        icon={Search} 
      />
      <DonorSearchForm onSearch={handleSearch} />
      
      {isLoading ? (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <DonorCardSkeleton key={i}/>)}
        </div>
      ) : filteredDonors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDonors.map((donor) => (
            <DonorCard key={donor.id} donor={donor} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 border-2 border-dashed border-muted-foreground/30 rounded-lg bg-card">
          <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground/70 mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No Donors Found</h3>
          <p className="text-muted-foreground">
            No donors match your current search criteria. Try broadening your search.
          </p>
        </div>
      )}
    </div>
  );
}


function DonorCardSkeleton() {
  return (
    <div className="p-6 border rounded-lg shadow-sm bg-card">
      <div className="flex items-center space-x-3 mb-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div>
          <Skeleton className="h-6 w-32 mb-1" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  );
}
