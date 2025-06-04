// src/app/auth/login/page.tsx
import { LoginForm } from "@/components/auth/login-form";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - Blood Donation App',
  description: 'Log in to your Blood Donation App account.',
};

export default function LoginPage() {
  return <LoginForm />;
}
