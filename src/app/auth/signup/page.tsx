// src/app/auth/signup/page.tsx
import { SignupForm } from "@/components/auth/signup-form";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up - LifeFlow',
  description: 'Create an account with LifeFlow to donate or request blood.',
};

export default function SignupPage() {
  return <SignupForm />;
}
