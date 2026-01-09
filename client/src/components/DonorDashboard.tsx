import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, TrendingUp, Calendar, Download, Search, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import type { Organization } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface DonorDashboardProps {
  onLogout: () => void;
}

export function DonorDashboard({ onLogout: _onLogout }: DonorDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [giftDialogOpen, setGiftDialogOpen] = useState(false);
  const [, setLocation] = useLocation();

  const { data: organizations = [] } = useQuery<Organization[]>({
    queryKey: ["/api/organizations"],
  });

  const filteredOrgs = organizations.filter(org => 
    org.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    org.type?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectOrg = (slug: string) => {
    setGiftDialogOpen(false);
    setLocation(`/give/${slug}`);
  };

  const mockDonations = [
    { id: "1", organization: "St. Mary's Catholic Church", fund: "General Fund", amount: 100, date: "2024-01-15", status: "completed" },
    { id: "2", organization: "St. Mary's Catholic Church", fund: "Building Fund", amount: 250, date: "2024-01-01", status: "completed" },
    { id: "3", organization: "Holy Cross Parish", fund: "Youth Ministry", amount: 50, date: "2023-12-25", status: "completed" },
  ];

  const stats = {
    totalGiven: "$1,425.00",
    thisYear: "$400.00",
    organizationsSupported: 2,
    lastGift: "Jan 15, 2024",
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold" data-testid="text-donor-welcome">
            Welcome back, Donor
          </h1>
          <p className="text-muted-foreground">Track your giving and make an impact</p>
        </div>
        <Dialog open={giftDialogOpen} onOpenChange={setGiftDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="default" data-testid="button-make-gift">
              <Heart className="h-4 w-4 mr-2" />
              Make a Gift
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Choose an Organization</DialogTitle>
              <DialogDescription>
                Select an organization to support with your gift
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {organizations.length > 0 ? (
                organizations.map((org) => (
                  <div
                    key={org.id}
                    className="p-3 rounded-lg border hover-elevate cursor-pointer"
                    onClick={() => handleSelectOrg(org.slug)}
                    data-testid={`dialog-org-${org.id}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{org.name}</p>
                        <p className="text-sm text-muted-foreground">{org.type || "Organization"}</p>
                      </div>
                      <Heart className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <Heart className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No organizations available yet</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Given</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-given">{stats.totalGiven}</div>
            <p className="text-xs text-muted-foreground">All-time contributions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Year</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-this-year">{stats.thisYear}</div>
            <p className="text-xs text-muted-foreground">Year-to-date giving</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Organizations</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-org-count">{stats.organizationsSupported}</div>
            <p className="text-xs text-muted-foreground">Causes you support</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Gift</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-last-gift">{stats.lastGift}</div>
            <p className="text-xs text-muted-foreground">Most recent donation</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle>Giving History</CardTitle>
                  <CardDescription>Your donations and contributions</CardDescription>
                </div>
                <Button variant="outline" size="sm" data-testid="button-download-receipts">
                  <Download className="h-4 w-4 mr-2" />
                  Tax Receipts
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockDonations.map((donation) => (
                  <div
                    key={donation.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                    data-testid={`donation-row-${donation.id}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Heart className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{donation.organization}</p>
                        <p className="text-sm text-muted-foreground">{donation.fund}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${donation.amount.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">{donation.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Find Organizations</CardTitle>
              <CardDescription>Discover causes to support</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search organizations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                  data-testid="input-search-orgs"
                />
              </div>
              <div className="space-y-2">
                {filteredOrgs.length > 0 ? (
                  filteredOrgs.slice(0, 5).map((org) => (
                    <Link key={org.id} href={`/org/${org.slug}`}>
                      <div 
                        className="p-3 rounded-lg border hover-elevate cursor-pointer"
                        data-testid={`org-card-${org.id}`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">{org.name}</p>
                            <p className="text-xs text-muted-foreground">{org.type || "Organization"}</p>
                          </div>
                          <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground text-sm">
                    {searchQuery ? "No organizations found" : "No organizations available yet"}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recurring Gifts</CardTitle>
              <CardDescription>Manage your subscriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6 text-muted-foreground">
                <Heart className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No recurring gifts set up</p>
                <Button variant="ghost" size="sm" className="mt-2">
                  Set up recurring giving
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
