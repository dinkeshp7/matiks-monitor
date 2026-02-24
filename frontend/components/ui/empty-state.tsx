"use client";

import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-white/30" />
        </div>
      )}
      <p className="text-white/70 font-medium">{title}</p>
      {description && <p className="text-white/40 text-sm mt-1 max-w-sm">{description}</p>}
    </div>
  );
}
