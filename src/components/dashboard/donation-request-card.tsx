// src/components/dashboard/donation-request-card.tsx
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { BloodRequest } from "@/types";
import { Droplet, MapPin, Phone, CalendarDays, CheckCircle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface DonationRequestCardProps {
  request: BloodRequest;
  onDonate: (requestId: string) => void;
}

export function DonationRequestCard({ request, onDonate }: DonationRequestCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="font-headline text-xl text-primary">{request.requesterName}</CardTitle>
            <CardDescription>Needs <Badge variant="destructive" className="bg-primary text-primary-foreground">{request.bloodGroup}</Badge> blood</CardDescription>
          </div>
          {request.isFulfilled ? (
            <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-300">
              <CheckCircle className="mr-1 h-4 w-4" /> Fulfilled
            </Badge>
          ) : (
             <Badge variant="outline" className="border-amber-400 text-amber-600 bg-amber-50">
              <AlertCircle className="mr-1 h-4 w-4" /> Pending
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mr-2 text-accent" />
          <span>{request.location}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4 mr-2 text-accent" />
          <span>Needed by: {format(new Date(request.dateNeeded), "PPP")}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Phone className="h-4 w-4 mr-2 text-accent" />
          <span>{request.contactNumber}</span>
        </div>
         <div className="flex items-center text-xs text-muted-foreground/80 pt-1">
          <span>Posted on: {format(new Date(request.createdAt), "PPp")}</span>
        </div>
      </CardContent>
      <CardFooter>
        {!request.isFulfilled && (
          <Button 
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" 
            onClick={() => onDonate(request.id)}
          >
            <Heart className="mr-2 h-4 w-4" /> Mark as Donated / Fulfill
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

// Placeholder Heart icon for the button, as lucide-react does not have a 'Donate' icon.
const Heart = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
