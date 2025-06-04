
// src/components/dashboard/user-profile-display.tsx
"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { User, ProfileDonationEntry, BadgeName } from "@/types";
import { DONATION_BADGES } from "@/types";
import { UserCircle, Mail, MapPin, Phone, CalendarDays, Droplet, Edit3, Gift, Award, Star, ShieldCheck, Heart } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface UserProfileDisplayProps {
  user: User | null;
  onEdit: () => void;
}

const BadgeIcon: React.FC<{ badgeName: BadgeName, className?: string }> = ({ badgeName, className }) => {
  switch (badgeName) {
    case DONATION_BADGES.FIRST_BLOOD_DROP:
      return <Award className={className} />;
    case DONATION_BADGES.HELPING_HAND:
      return <Star className={className} />;
    case DONATION_BADGES.LIFE_GUARDIAN:
      return <ShieldCheck className={className} />;
    case DONATION_BADGES.COMMUNITY_HERO:
      return <Heart className={className} />; // Using lucide-react Heart
    default:
      return <Gift className={className} />; // Default icon
  }
};


export function UserProfileDisplay({ user, onEdit }: UserProfileDisplayProps) {

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

  const {
    firstName,
    lastName,
    email,
    bloodGroup,
    dateOfBirth,
    age,
    address,
    contactNumber,
    donationCount = 0, // Default to 0 if undefined
    badges = [],       // Default to empty array if undefined
    donationHistory = [], // Default to empty array
  } = user;


  return (
    <Card className="shadow-xl">
      <CardHeader className="text-center">
        <UserCircle className="h-24 w-24 text-primary mx-auto mb-4" />
        <CardTitle className="font-headline text-3xl text-primary">{firstName} {lastName}</CardTitle>
        <CardDescription className="text-lg">Blood Group: <span className="font-semibold text-accent">{bloodGroup || "N/A"}</span></CardDescription>
        <CardDescription className="text-md">Total Donations: <span className="font-semibold text-accent">{donationCount}</span></CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 p-6 sm:p-8">
        <div className="flex items-start space-x-3">
          <Mail className="h-5 w-5 text-accent mt-1 shrink-0" />
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium text-foreground">{email}</p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <Phone className="h-5 w-5 text-accent mt-1 shrink-0" />
          <div>
            <p className="text-sm text-muted-foreground">Contact Number</p>
            <p className="font-medium text-foreground">{contactNumber || "Not set"}</p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <CalendarDays className="h-5 w-5 text-accent mt-1 shrink-0" />
          <div>
            <p className="text-sm text-muted-foreground">Date of Birth / Age</p>
            <p className="font-medium text-foreground">
              {dateOfBirth ? format(new Date(dateOfBirth), "PPP") : "Not set"} ({age && age > 0 ? `${age} years old` : "Age not set"})
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <MapPin className="h-5 w-5 text-accent mt-1 shrink-0" />
          <div>
            <p className="text-sm text-muted-foreground">Address</p>
            <p className="font-medium text-foreground">{address || "Not set"}</p>
          </div>
        </div>

        {badges.length > 0 && (
          <div className="pt-4 border-t">
            <h3 className="text-lg font-semibold text-primary mb-3 flex items-center">
              <Award className="h-5 w-5 mr-2 text-primary" /> Earned Badges
            </h3>
            <div className="flex flex-wrap gap-2">
              {badges.map((badgeName) => (
                <Badge key={badgeName} variant="secondary" className="bg-accent/10 text-accent border-accent/30 text-sm px-3 py-1">
                  <BadgeIcon badgeName={badgeName as BadgeName} className="mr-2 h-4 w-4" />
                  {badgeName}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {donationHistory && donationHistory.length > 0 && (
          <div className="pt-4 border-t">
            <h3 className="text-lg font-semibold text-primary mb-2 flex items-center">
              <Droplet className="h-5 w-5 mr-2 text-primary" /> Donation History ({donationHistory.length})
            </h3>
            <ul className="space-y-2 list-disc list-inside text-muted-foreground text-sm max-h-48 overflow-y-auto pr-2">
              {donationHistory.map((donation, index) => (
                <li key={index} className="truncate">
                  Donated on {format(new Date(donation.date), "PPP")}
                  {donation.notes && <span className="text-xs block text-muted-foreground/80"> ({donation.notes})</span>}
                </li>
              ))}
            </ul>
          </div>
        )}
         {(!donationHistory || donationHistory.length === 0) && (
           <div className="pt-4 border-t text-center">
             <p className="text-muted-foreground italic">No donation history recorded yet.</p>
           </div>
         )}
      </CardContent>
       <CardFooter className="pt-6 border-t text-center">
          <Button onClick={onEdit} className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto">
            <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
          </Button>
        </CardFooter>
    </Card>
  );
}
