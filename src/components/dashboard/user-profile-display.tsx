// src/components/dashboard/user-profile-display.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { User } from "@/types";
import { UserCircle, Mail, MapPin, Phone, CalendarDays, Droplet, Edit3 } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface UserProfileDisplayProps {
  user: User | null; // User can be null if not loaded yet
}

export function UserProfileDisplay({ user }: UserProfileDisplayProps) {
  const { toast } = useToast();

  const handleEditProfile = () => {
    // Mock edit profile action
    toast({
      title: "Edit Profile",
      description: "Profile editing functionality is not yet implemented in this demo.",
    });
  };
  
  if (!user) {
    return (
      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <UserCircle className="h-12 w-12 text-primary" />
            <div>
              <CardTitle className="font-headline text-2xl text-primary">Loading Profile...</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-6 bg-muted rounded w-3/4 animate-pulse"></div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto shadow-xl">
      <CardHeader className="text-center">
        <UserCircle className="h-24 w-24 text-primary mx-auto mb-4" />
        <CardTitle className="font-headline text-3xl text-primary">{user.firstName} {user.lastName}</CardTitle>
        <CardDescription className="text-lg">Blood Group: <span className="font-semibold text-accent">{user.bloodGroup}</span></CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 p-6 sm:p-8">
        <div className="flex items-start space-x-3">
          <Mail className="h-5 w-5 text-accent mt-1 shrink-0" />
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium text-foreground">{user.email}</p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <Phone className="h-5 w-5 text-accent mt-1 shrink-0" />
          <div>
            <p className="text-sm text-muted-foreground">Contact Number</p>
            <p className="font-medium text-foreground">{user.contactNumber}</p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <CalendarDays className="h-5 w-5 text-accent mt-1 shrink-0" />
          <div>
            <p className="text-sm text-muted-foreground">Date of Birth / Age</p>
            <p className="font-medium text-foreground">
              {format(new Date(user.dateOfBirth), "PPP")} ({user.age} years old)
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <MapPin className="h-5 w-5 text-accent mt-1 shrink-0" />
          <div>
            <p className="text-sm text-muted-foreground">Address</p>
            <p className="font-medium text-foreground">{user.address}</p>
          </div>
        </div>
        
        {user.donationHistory && user.donationHistory.length > 0 && (
          <div className="pt-4 border-t">
            <h3 className="text-lg font-semibold text-primary mb-2 flex items-center">
              <Droplet className="h-5 w-5 mr-2 text-primary" /> Donation History
            </h3>
            <ul className="space-y-1 list-disc list-inside text-muted-foreground">
              {user.donationHistory.map((donation, index) => (
                <li key={index}>
                  Donated {donation.quantity || '1 unit'} on {format(new Date(donation.dateOfDonation), "PPP")}
                </li>
              ))}
            </ul>
          </div>
        )}
         {!user.donationHistory || user.donationHistory.length === 0 && (
           <div className="pt-4 border-t text-center">
             <p className="text-muted-foreground italic">No donation history recorded yet.</p>
           </div>
         )}
        <div className="pt-6 text-center">
          <Button onClick={handleEditProfile} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Edit3 className="mr-2 h-4 w-4" /> Edit Profile (Mock)
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
