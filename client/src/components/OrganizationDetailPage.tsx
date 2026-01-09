import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart, MapPin, Building2, Target, Users } from "lucide-react";
import type { Organization, Fund } from "@shared/schema";

export function OrganizationDetailPage() {
  const [, params] = useRoute("/org/:slug");
  const slug = params?.slug || "";

  const { data: organization, isLoading: orgLoading } = useQuery<Organization>({
    queryKey: [`/api/organization/slug/${slug}`],
    enabled: !!slug,
  });

  const { data: funds } = useQuery<Fund[]>({
    queryKey: [`/api/organization/${organization?.id}/funds`],
    enabled: !!organization?.id,
  });

  if (orgLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-muted-foreground">Loading organization...</div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-bold">Organization not found</h1>
        <Link href="/donor">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  const enabledFunds = funds?.filter(f => f.enabled) || [];

  return (
    <div className="min-h-screen bg-background">
      <div 
        className="relative h-48 md:h-64"
        style={{ 
          backgroundColor: organization.primaryColor || "#7c3aed",
          backgroundImage: organization.coverImageUrl ? `url(${organization.coverImageUrl})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-6">
            <Link href="/donor">
              <Button variant="ghost" className="text-white hover:bg-white/20 mb-4" data-testid="button-back-dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-white" data-testid="text-org-name">
              {organization.name || "Organization"}
            </h1>
            {organization.type && (
              <Badge variant="secondary" className="mt-2" data-testid="badge-org-type">
                {organization.type}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  About Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed" data-testid="text-about">
                  {organization.aboutText || `Welcome to ${organization.name}. Your generous gifts support our programs, outreach, and facilities.`}
                </p>
                {organization.address && (
                  <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span data-testid="text-address">{organization.address}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Campaigns & Funds
                </CardTitle>
                <CardDescription>Support our various initiatives</CardDescription>
              </CardHeader>
              <CardContent>
                {enabledFunds.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {enabledFunds.map((fund) => (
                      <div 
                        key={fund.id} 
                        className="p-4 rounded-lg border hover-elevate cursor-pointer"
                        data-testid={`fund-card-${fund.id}`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{fund.name}</p>
                            <p className="text-sm text-muted-foreground">Active campaign</p>
                          </div>
                          <Heart className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No active campaigns at this time</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Make a Gift</CardTitle>
                <CardDescription>Support {organization.name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Your contribution helps us continue our mission and serve our community.
                </p>
                <Link href={`/give/${organization.slug}`}>
                  <Button 
                    className="w-full" 
                    style={{ backgroundColor: organization.primaryColor || undefined }}
                    data-testid="button-donate"
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    {organization.buttonText || "Give Now"}
                  </Button>
                </Link>
                {organization.enableRecurring && (
                  <p className="text-xs text-center text-muted-foreground">
                    Recurring giving options available
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Community Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Donors this month</span>
                    <span className="font-medium">--</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Funds supported</span>
                    <span className="font-medium">{enabledFunds.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {organization.showGoalMeter && organization.goalAmount && (
              <Card>
                <CardHeader>
                  <CardTitle>Fundraising Goal</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">${Number(organization.goalAmount).toLocaleString()} goal</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full"
                        style={{ 
                          width: "0%",
                          backgroundColor: organization.primaryColor || undefined 
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
