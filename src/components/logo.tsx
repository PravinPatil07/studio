import { Droplet } from 'lucide-react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  iconSize?: number;
  textSize?: string;
}

export function Logo({ className, iconSize = 32, textSize = 'text-3xl' }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2 text-primary ${className}`}>
      <Droplet size={iconSize} className="text-primary" />
      <span className={`font-headline font-bold ${textSize}`}>Blood Donation App</span>
    </Link>
  );
}
