// src/app/auth/signup/page.tsx
import { SignupForm } from "@/components/auth/signup-form";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up - Blood Donation App',
  description: 'Create an account with Blood Donation App to donate or request blood.',
};

export default function SignupPage() {
  return <SignupForm />;
}
