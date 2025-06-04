// src/app/(app)/dashboard/blood-info/page.tsx
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { bloodCompatibilityInfo, type BloodGroup } from "@/types";
import { Info, Droplet } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blood Group Information - Blood Donation App',
  description: 'Learn about blood group compatibility for donations and transfusions.',
};

export default function BloodInfoPage() {
  const bloodGroups = Object.keys(bloodCompatibilityInfo) as BloodGroup[];

  return (
    <div>
      <PageHeader 
        title="Blood Group Information" 
        description="Understand blood type compatibility for donations and receiving."
        icon={Info} 
      />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary flex items-center">
            <Droplet className="mr-2 h-6 w-6" />
            Blood Type Compatibility Chart
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-muted-foreground">
            This chart shows which blood types can donate to and receive from others. Understanding compatibility is crucial for safe transfusions.
          </p>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold text-primary">Blood Type</TableHead>
                  <TableHead className="font-semibold text-primary">Can Donate To</TableHead>
                  <TableHead className="font-semibold text-primary">Can Receive From</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bloodGroups.map((group) => (
                  <TableRow key={group}>
                    <TableCell className="font-medium">{group}</TableCell>
                    <TableCell>{bloodCompatibilityInfo[group].canDonateTo.join(", ")}</TableCell>
                    <TableCell>{bloodCompatibilityInfo[group].canReceiveFrom.join(", ")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-8 shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary">Why Blood Types Matter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-foreground/90">
          <p>
            Your blood type is determined by antigens (specific proteins) on the surface of your red blood cells. There are two main antigen systems: ABO and Rh.
          </p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li><strong>ABO System:</strong> Classifies blood into four types: A, B, AB, and O.</li>
            <li><strong>Rh System:</strong> Classifies blood as Rh-positive (+) or Rh-negative (-), based on the presence or absence of the RhD antigen.</li>
          </ul>
          <p>
            If someone receives blood from a donor with an incompatible blood type, their immune system can react against the transfused blood cells, leading to a serious, potentially life-threatening reaction. This is why accurate blood typing and crossmatching are vital before any transfusion.
          </p>
          <p>
            <strong>O-negative (O-)</strong> blood is often called the "universal donor" type because it is compatible with all other blood types.
          </p>
          <p>
            <strong>AB-positive (AB+)</strong> blood is often called the "universal recipient" type because individuals with this type can receive blood from any ABO/Rh type.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
