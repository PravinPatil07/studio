
// src/components/layout/sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlusSquare, Search, Info, Zap, Award, UserCircle, LogOut, Trophy, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth-client";
import { Logo } from "@/components/logo";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/request-blood", label: "Request Blood", icon: PlusSquare },
  { href: "/dashboard/find-donor", label: "Find Donor", icon: Search },
  { href: "/dashboard/achievements", label: "Achievements", icon: Trophy },
  { href: "/dashboard/blood-info", label: "Blood Info", icon: Info },
  { href: "/dashboard/ai-guidance", label: "AI Guidance", icon: Zap },
  { href: "/dashboard/certificates", label: "Certificates", icon: Award },
  { href: "/dashboard/profile", label: "Profile", icon: UserCircle },
];

interface SidebarProps {
  isMobileSheetOpen: boolean;
  onMobileSheetClose: (isOpen: boolean) => void;
}

function SidebarNavigationContent({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    onLinkClick?.(); // Close sheet if open
  };

  const displayName = user?.displayName || user?.email;

  return (
    <>
      <div className="p-6 border-b border-sidebar-border">
        <Logo className="text-sidebar-foreground" iconSize={28} textSize="text-2xl" />
      </div>
      <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Button
            key={item.label}
            asChild
            variant={pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href)) ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start space-x-3 text-sm font-medium transition-colors h-auto py-2.5 px-3",
               pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
                ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
            onClick={onLinkClick}
          >
            <Link href={item.href}>
              <item.icon className="h-5 w-5 mr-3" />
              <span>{item.label}</span>
            </Link>
          </Button>
        ))}
      </nav>
      <div className="p-4 border-t border-sidebar-border">
        {displayName && (
          <p className="text-xs text-sidebar-foreground/70 mb-2 truncate" title={displayName}>
            Logged in as: {displayName}
          </p>
        )}
        <Button
          variant="ghost"
          className="w-full justify-start space-x-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </Button>
      </div>
    </>
  );
}


export function Sidebar({ isMobileSheetOpen, onMobileSheetClose }: SidebarProps) {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-64 h-screen bg-sidebar text-sidebar-foreground flex-col fixed shadow-lg hidden md:flex">
        <SidebarNavigationContent />
      </aside>

      {/* Mobile Sidebar (Sheet) */}
      <div className="md:hidden">
        <Sheet open={isMobileSheetOpen} onOpenChange={onMobileSheetClose}>
          <SheetContent side="left" className="w-72 bg-sidebar text-sidebar-foreground p-0 flex flex-col">
             <SheetHeader className="p-4 border-b border-sidebar-border flex flex-row justify-between items-center">
              <SheetTitle className="text-left">
                <Logo className="text-sidebar-foreground" iconSize={24} textSize="text-xl" />
              </SheetTitle>
              <SheetClose asChild>
                <Button variant="ghost" size="icon" className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </Button>
              </SheetClose>
            </SheetHeader>
            <SidebarNavigationContent onLinkClick={() => onMobileSheetClose(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
