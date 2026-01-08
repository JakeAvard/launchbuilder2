import { MetricCard } from "./MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  Calendar, 
  Gift, 
  TrendingUp, 
  UserPlus,
  ExternalLink,
  Settings,
  FileText,
  CreditCard
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useOrganization } from "@/App";
import { useLocation } from "wouter";
import { formatDistanceToNow } from "date-fns";
import type { Donation } from "@shared/schema";

const quickActions = [
  { label: "View Giving Page", icon: ExternalLink, href: "/giving-page" },
  { label: "Payment Settings", icon: CreditCard, href: "/settings" },
  { label: "Export Report", icon: FileText, href: "#" },
];

export function Dashboard() {
  const { organization } = useOrganization();
  const [, setLocation] = useLocation();

  const { data: stats, isLoading: statsLoading } = useQuery<{
    todayTotal: string;
    monthTotal: string;
    giftCountToday: number;
    giftCountMonth: number;
    giftCountYear: number;
    averageGift: string;
    newDonorsThisMonth: number;
  }>({
    queryKey: ["/api/organization", organization?.id, "stats"],
    enabled: !!organization?.id,
  });

  const { data: recentDonations, isLoading: donationsLoading } = useQuery<Donation[]>({
    queryKey: ["/api/organization", organization?.id, "donations"],
    enabled: !!organization?.id,
  });

  const metrics = stats || {
    todayTotal: "$0.00",
    monthTotal: "$0.00",
    giftCountToday: 0,
    giftCountMonth: 0,
    giftCountYear: 0,
    averageGift: "$0.00",
    newDonorsThisMonth: 0
  };

  const handleQuickAction = (href: string) => {
    if (href !== "#") {
      setLocation(href);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold" data-testid="text-dashboard-title">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's how your giving is doing.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action) => (
            <Button 
              key={action.label} 
              variant="outline" 
              className="gap-2" 
              data-testid={`button-${action.label.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={() => handleQuickAction(action.href)}
            >
              <action.icon className="h-4 w-4" />
              {action.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Today's Total"
          value={statsLoading ? "..." : metrics.todayTotal}
          icon={DollarSign}
          trend={{ value: "+12%", direction: "up" }}
        />
        <MetricCard
          title="Month-to-Date"
          value={statsLoading ? "..." : metrics.monthTotal}
          icon={Calendar}
          trend={{ value: "+8%", direction: "up" }}
        />
        <MetricCard
          title="Gifts This Month"
          value={statsLoading ? "..." : String(metrics.giftCountMonth)}
          subtitle={`${metrics.giftCountToday} today • ${metrics.giftCountYear} this year`}
          icon={Gift}
        />
        <MetricCard
          title="Average Gift"
          value={statsLoading ? "..." : metrics.averageGift}
          icon={TrendingUp}
          trend={{ value: "+5%", direction: "up" }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <CardTitle className="font-heading">Recent Activity</CardTitle>
            <Button variant="ghost" size="sm" data-testid="button-view-all-activity">
              View all
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {donationsLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : !recentDonations || recentDonations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No donations yet. Share your giving page to start receiving gifts!
                </div>
              ) : (
                recentDonations.slice(0, 5).map((donation) => (
                  <div
                    key={donation.id}
                    className="flex items-center justify-between gap-4 py-3 border-b last:border-0"
                    data-testid={`row-activity-${donation.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-chart-2/10 text-chart-2">
                        <Gift className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{donation.isAnonymous ? "Anonymous" : donation.donorName || "Donor"}</p>
                        <p className="text-sm text-muted-foreground">{donation.fundName || "General"}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${parseFloat(donation.amount).toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">
                        {donation.createdAt ? formatDistanceToNow(new Date(donation.createdAt), { addSuffix: true }) : "Just now"}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                New Donors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-heading text-4xl font-bold mb-2" data-testid="text-new-donors-count">
                {statsLoading ? "..." : metrics.newDonorsThisMonth}
              </p>
              <p className="text-sm text-muted-foreground">This month</p>
              <div className="mt-4 pt-4 border-t">
                <Button 
                  variant="outline" 
                  className="w-full gap-2" 
                  data-testid="button-view-donors"
                  onClick={() => setLocation("/donors")}
                >
                  View all donors
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-heading flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Quick Setup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Bank account</span>
                <Badge variant="outline" className={organization?.bankConnected ? "text-chart-2 border-chart-2" : ""}>
                  {organization?.bankConnected ? "Connected" : "Pending"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Verification</span>
                <Badge variant="outline" className={organization?.isVerified ? "text-chart-2 border-chart-2" : ""}>
                  {organization?.isVerified ? "Verified" : "Pending"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Email receipts</span>
                <Badge variant="outline">Configure</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
