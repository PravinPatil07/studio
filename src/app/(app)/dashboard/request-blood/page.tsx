// src/app/(app)/dashboard/request-blood/page.tsx
import { BloodRequestForm } from "@/components/dashboard/blood-request-form";
import { PageHeader } from "@/components/layout/page-header";
import { PlusSquare } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Request Blood - LifeFlow',
  description: 'Submit a new blood request to the LifeFlow community.',
};

export default function RequestBloodPage() {
  return (
    <div>
      <PageHeader 
        title="Request Blood" 
        description="Fill out the form below to post a blood request. Your request will be visible to potential donors."
        icon={PlusSquare} 
      />
      <BloodRequestForm />
    </div>
  );
}
