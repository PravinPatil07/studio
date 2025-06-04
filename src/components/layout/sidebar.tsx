
// src/components/layout/sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlusSquare, Search, Info, Zap, Award, UserCircle, LogOut, Droplet } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth-client";
import { Logo } from "@/components/logo";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/request-blood", label: "Request Blood", icon: PlusSquare },
  { href: "/dashboard/find-donor", label: "Find Donor", icon: Search },
  { href: "/dashboard/blood-info", label: "Blood Info", icon: Info },
  { href: "/dashboard/ai-guidance", label: "AI Guidance", icon: Zap },
  { href: "/dashboard/certificates", label: "Certificates", icon: Award },
  { href: "/dashboard/profile", label: "Profile", icon: UserCircle },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <aside className="w-64 h-screen bg-sidebar text-sidebar-foreground flex flex-col fixed shadow-lg">
      <div className="p-6 border-b border-sidebar-border">
         <Logo className="text-sidebar-foreground" iconSize={28} textSize="text-2xl" />
      </div>
      <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <Link key={item.label} href={item.href} legacyBehavior passHref>
            <a
              className={cn(
                "flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </a>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-sidebar-border">
        {user?.email && <p className="text-xs text-sidebar-foreground/70 mb-2 truncate" title={user.email}>Logged in as: {user.email}</p>}
        <Button
          variant="ghost"
          className="w-full justify-start space-x-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </Button>
      </div>
    </aside>
  );
}
