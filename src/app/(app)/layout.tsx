
// src/app/(app)/layout.tsx
"use client"; 

import { Sidebar } from "@/components/layout/sidebar";
import { useAuth } from "@/hooks/use-auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Logo } from "@/components/logo";

function MobileHeader({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="md:hidden fixed top-0 left-0 right-0 z-40 h-16 flex items-center justify-between px-4 bg-background/95 backdrop-blur-sm border-b">
      <Logo iconSize={24} textSize="text-xl" />
      <Button variant="ghost" size="icon" onClick={onMenuClick} aria-label="Open menu">
        <Menu className="h-6 w-6" />
      </Button>
    </header>
  );
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
            <svg className="animate-spin h-12 w-12 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-muted-foreground font-headline">Loading Blood Donation App...</p>
        </div>
      </div>
    );
  }

  if (!user) {
     // This will be briefly shown before redirect effect kicks in
    return (
       <div className="flex h-screen w-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Redirecting to login...</p>
      </div>
    );
  }

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="flex h-screen bg-background">
      <MobileHeader onMenuClick={toggleMobileMenu} />
      <Sidebar 
        isMobileSheetOpen={isMobileMenuOpen}
        onMobileSheetClose={() => setIsMobileMenuOpen(false)}
      />
      <main className="flex-1 overflow-y-auto p-6 lg:p-8 pt-20 md:pt-6 md:ml-64">
        {children}
      </main>
    </div>
  );
}
