// src/components/dashboard/donor-card.tsx
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { DonorSearchResult } from "@/types";
import { User, Droplet, MapPin, Phone, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNowStrict } from "date-fns";

interface DonorCardProps {
  donor: DonorSearchResult;
}

export function DonorCard({ donor }: DonorCardProps) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <User className="h-8 w-8 text-primary" />
          <div>
            <CardTitle className="font-headline text-xl text-primary">{donor.name}</CardTitle>
            <CardDescription>Blood Group: <Badge variant="secondary" className="bg-primary/10 text-primary">{donor.bloodGroup}</Badge></CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mr-2 text-accent" />
          <span>{donor.city}</span>
        </div>
        {donor.lastDonationDate && (
           <div className="flex items-center text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4 mr-2 text-accent" />
            <span>Last donated: {formatDistanceToNowStrict(new Date(donor.lastDonationDate), { addSuffix: true })}</span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
          <Phone className="mr-2 h-4 w-4" /> Contact Donor (Mock)
        </Button>
      </CardFooter>
    </Card>
  );
}
