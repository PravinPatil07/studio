// src/app/auth/login/page.tsx
import { LoginForm } from "@/components/auth/login-form";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - LifeFlow',
  description: 'Log in to your LifeFlow account.',
};

export default function LoginPage() {
  return <LoginForm />;
}
