import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CreditCard, 
  Receipt, 
  Users, 
  Building2,
  ExternalLink,
  Check,
  AlertCircle
} from "lucide-react";

export function SettingsPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold" data-testid="text-settings-title">Settings</h1>
        <p className="text-muted-foreground">Manage your organization settings and preferences.</p>
      </div>

      <Tabs defaultValue="organization" className="space-y-6">
        <TabsList>
          <TabsTrigger value="organization" data-testid="tab-organization">Organization</TabsTrigger>
          <TabsTrigger value="payments" data-testid="tab-payments">Payments</TabsTrigger>
          <TabsTrigger value="receipts" data-testid="tab-receipts">Receipts</TabsTrigger>
          <TabsTrigger value="team" data-testid="tab-team">Team</TabsTrigger>
        </TabsList>

        <TabsContent value="organization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Organization Details
              </CardTitle>
              <CardDescription>
                Basic information about your parish or organization.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Organization Name</Label>
                  <Input id="name" defaultValue="St. Mary's Catholic Church" data-testid="input-settings-name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ein">EIN / Tax ID</Label>
                  <Input id="ein" defaultValue="12-3456789" data-testid="input-settings-ein" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Contact Email</Label>
                  <Input id="email" type="email" defaultValue="office@stmarys.org" data-testid="input-settings-email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" defaultValue="(555) 123-4567" data-testid="input-settings-phone" />
                </div>
              </div>
              <Button data-testid="button-save-org">Save Changes</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Verification Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 p-4 rounded-lg bg-chart-2/10">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-chart-2 text-white">
                  <Check className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Your organization is verified</p>
                  <p className="text-sm text-muted-foreground">
                    Donors see a verification badge on your giving page.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Settings
              </CardTitle>
              <CardDescription>
                Configure how you receive donations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-2/10 text-chart-2">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Bank Account</p>
                    <p className="text-sm text-muted-foreground">••••4589 - First National Bank</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-chart-2 border-chart-2">Connected</Badge>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Processing Fees</p>
                    <p className="text-sm text-muted-foreground">2.9% + $0.30 per transaction</p>
                  </div>
                  <Button variant="outline" size="sm" data-testid="button-view-fees">
                    View Details
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Allow donors to cover fees</p>
                    <p className="text-sm text-muted-foreground">
                      Give donors the option to add fees to their gift.
                    </p>
                  </div>
                  <Switch defaultChecked data-testid="switch-cover-fees" />
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Deposits typically arrive in 3-5 business days. Powered by Tither Pay.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="receipts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Email Receipts
              </CardTitle>
              <CardDescription>
                Configure automatic donation receipts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Send automatic receipts</p>
                  <p className="text-sm text-muted-foreground">
                    Email donors a receipt after each gift.
                  </p>
                </div>
                <Switch defaultChecked data-testid="switch-auto-receipts" />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Receipt message</Label>
                  <Input 
                    defaultValue="Thank you for your generous gift to St. Mary's Catholic Church." 
                    data-testid="input-receipt-message"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Reply-to email</Label>
                  <Input 
                    type="email" 
                    defaultValue="giving@stmarys.org" 
                    data-testid="input-reply-email"
                  />
                </div>
              </div>

              <Button data-testid="button-save-receipts">Save Receipt Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardTitle className="font-heading flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Team Members
                </CardTitle>
                <CardDescription>
                  Manage who has access to your Tither account.
                </CardDescription>
              </div>
              <Button data-testid="button-invite-member">Invite Member</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Father John Smith", email: "fr.john@stmarys.org", role: "Admin" },
                  { name: "Mary Johnson", email: "mary.j@stmarys.org", role: "Editor" },
                  { name: "You", email: "admin@stmarys.org", role: "Owner" },
                ].map((member, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg" data-testid={`row-team-member-${i}`}>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                    <Badge variant="secondary">{member.role}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
