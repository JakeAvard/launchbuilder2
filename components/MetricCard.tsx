import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: {
    value: string;
    direction: "up" | "down";
  };
  icon: LucideIcon;
}

export function MetricCard({ title, value, subtitle, trend, icon: Icon }: MetricCardProps) {
  return (
    <Card className="relative overflow-visible" data-testid={`card-metric-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-sm ${trend.direction === "up" ? "text-chart-2" : "text-destructive"}`}>
              {trend.direction === "up" ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>{trend.value}</span>
            </div>
          )}
        </div>
        <div className="mt-4">
          <p className="font-heading text-3xl font-bold" data-testid={`text-metric-value-${title.toLowerCase().replace(/\s+/g, "-")}`}>{value}</p>
          <p className="text-sm text-muted-foreground">{title}</p>
          {subtitle && (
            <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
