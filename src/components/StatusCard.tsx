
import { ReactNode } from "react";

interface StatusCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: string;
  subtitle?: string;
}

export function StatusCard({ title, value, icon, color, subtitle }: StatusCardProps) {
  return (
    <div className="clay-card hover:animate-pulse-gentle transition-all">
      <h3 className="text-sm font-medium text-muted-foreground mb-2">{title}</h3>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-3xl font-bold">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full ${color}`}>{icon}</div>
      </div>
    </div>
  );
}
