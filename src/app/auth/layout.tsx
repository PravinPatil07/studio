// src/app/auth/layout.tsx
import { Logo } from "@/components/logo";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-100 via-red-100 to-rose-200 p-4">
      <div className="absolute top-8 left-8">
        <Logo />
      </div>
      {children}
    </div>
  );
}
