import { MetricCard } from "../MetricCard";
import { DollarSign } from "lucide-react";

export default function MetricCardExample() {
  return (
    <MetricCard
      title="Today's Total"
      value="$1,247.00"
      icon={DollarSign}
      trend={{ value: "+12%", direction: "up" }}
    />
  );
}
