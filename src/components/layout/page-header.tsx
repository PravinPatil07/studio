
// src/components/layout/page-header.tsx
import type { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
}

export function PageHeader({ title, description, icon: Icon }: PageHeaderProps) {
  return (
    <div className="mb-6 sm:mb-8 pb-4 border-b border-border">
      <div className="flex items-center space-x-2 sm:space-x-3">
        {Icon && <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />}
        <h1 className="text-2xl sm:text-3xl font-headline font-semibold text-primary">{title}</h1>
      </div>
      {description && <p className="mt-1 text-sm sm:text-base text-muted-foreground">{description}</p>}
    </div>
  );
}
