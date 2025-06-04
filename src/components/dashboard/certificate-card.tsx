// src/components/dashboard/certificate-card.tsx
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Certificate } from "@/types";
import Image from "next/image";
import { Award, Download, Share2 } from "lucide-react";
import { format } from "date-fns";

interface CertificateCardProps {
  certificate: Certificate;
}

export function CertificateCard({ certificate }: CertificateCardProps) {
  const handleDownload = () => {
    // Mock download: in a real app, this would trigger a file download
    alert(`Downloading certificate ${certificate.id}... (mock)`);
  };

  const handleShare = () => {
    // Mock share: in a real app, this would open a share dialog
    alert(`Sharing certificate ${certificate.id}... (mock)`);
  };

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <Award className="h-8 w-8 text-primary" />
          <div>
            <CardTitle className="font-headline text-xl text-primary">Donation Certificate</CardTitle>
            <CardDescription>Issued on: {format(new Date(certificate.issueDate), "PPP")}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="aspect-[4/3] bg-muted rounded-md overflow-hidden relative border border-border">
          <Image 
            src={certificate.certificateUrl} 
            alt={`Certificate for donation ${certificate.donationId}`} 
            layout="fill"
            objectFit="cover"
            data-ai-hint="certificate document"
          />
        </div>
        <p className="text-sm text-muted-foreground mt-2 text-center">Certificate ID: {certificate.id}</p>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2">
        <Button onClick={handleDownload} className="w-full sm:w-auto flex-1 bg-accent hover:bg-accent/90 text-accent-foreground">
          <Download className="mr-2 h-4 w-4" /> Download
        </Button>
        <Button onClick={handleShare} variant="outline" className="w-full sm:w-auto flex-1">
          <Share2 className="mr-2 h-4 w-4" /> Share
        </Button>
      </CardFooter>
    </Card>
  );
}
