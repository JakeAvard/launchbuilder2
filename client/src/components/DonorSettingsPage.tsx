import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { User, Bell, Shield, CreditCard, Trash2, LogOut } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface DonorSettingsPageProps {
  onLogout: () => void;
}

export function DonorSettingsPage({ onLogout }: DonorSettingsPageProps) {
  const { toast } = useToast();
  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Donor",
    email: "john@example.com",
    phone: "(555) 123-4567",
  });

  const [notifications, setNotifications] = useState({
    emailReceipts: true,
    monthlyReport: true,
    givingReminders: false,
    organizationUpdates: true,
    marketingEmails: false,
  });

  const [privacy, setPrivacy] = useState({
    anonymousByDefault: false,
    hideFromLeaderboards: false,
    allowOrganizationContact: true,
  });

  const handleSaveProfile = () => {
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved.",
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Preferences saved",
      description: "Your notification preferences have been updated.",
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold" data-testid="text-settings-title">
          Account Settings
        </h1>
        <p className="text-muted-foreground">Manage your profile, preferences, and account</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <User className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={profile.firstName}
                onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                data-testid="input-first-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={profile.lastName}
                onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                data-testid="input-last-name"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              data-testid="input-email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              data-testid="input-phone"
            />
          </div>
          <Button onClick={handleSaveProfile} data-testid="button-save-profile">
            Save Changes
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Choose how you want to be notified</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="font-medium">Email Receipts</p>
                <p className="text-sm text-muted-foreground">Receive a receipt after each donation</p>
              </div>
              <Switch
                checked={notifications.emailReceipts}
                onCheckedChange={(checked) => setNotifications({ ...notifications, emailReceipts: checked })}
                data-testid="switch-email-receipts"
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="font-medium">Monthly Giving Report</p>
                <p className="text-sm text-muted-foreground">Summary of your monthly donations</p>
              </div>
              <Switch
                checked={notifications.monthlyReport}
                onCheckedChange={(checked) => setNotifications({ ...notifications, monthlyReport: checked })}
                data-testid="switch-monthly-report"
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="font-medium">Giving Reminders</p>
                <p className="text-sm text-muted-foreground">Gentle reminders to support your causes</p>
              </div>
              <Switch
                checked={notifications.givingReminders}
                onCheckedChange={(checked) => setNotifications({ ...notifications, givingReminders: checked })}
                data-testid="switch-giving-reminders"
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="font-medium">Organization Updates</p>
                <p className="text-sm text-muted-foreground">News from organizations you support</p>
              </div>
              <Switch
                checked={notifications.organizationUpdates}
                onCheckedChange={(checked) => setNotifications({ ...notifications, organizationUpdates: checked })}
                data-testid="switch-org-updates"
              />
            </div>
          </div>
          <Button onClick={handleSaveNotifications} data-testid="button-save-notifications">
            Save Preferences
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Privacy</CardTitle>
              <CardDescription>Control your privacy settings</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="font-medium">Anonymous by Default</p>
                <p className="text-sm text-muted-foreground">Hide your name on all donations</p>
              </div>
              <Switch
                checked={privacy.anonymousByDefault}
                onCheckedChange={(checked) => setPrivacy({ ...privacy, anonymousByDefault: checked })}
                data-testid="switch-anonymous"
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="font-medium">Hide from Leaderboards</p>
                <p className="text-sm text-muted-foreground">Don't show my giving on public lists</p>
              </div>
              <Switch
                checked={privacy.hideFromLeaderboards}
                onCheckedChange={(checked) => setPrivacy({ ...privacy, hideFromLeaderboards: checked })}
                data-testid="switch-hide-leaderboards"
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="font-medium">Allow Organization Contact</p>
                <p className="text-sm text-muted-foreground">Let organizations reach out to you</p>
              </div>
              <Switch
                checked={privacy.allowOrganizationContact}
                onCheckedChange={(checked) => setPrivacy({ ...privacy, allowOrganizationContact: checked })}
                data-testid="switch-allow-contact"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your saved payment methods</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <CreditCard className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>No payment methods saved</p>
            <p className="text-sm mt-1">Payment methods are saved when you make a donation</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions for your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/20 bg-destructive/5">
            <div className="flex items-center gap-3">
              <LogOut className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Sign Out</p>
                <p className="text-sm text-muted-foreground">Sign out of your account</p>
              </div>
            </div>
            <Button variant="outline" onClick={onLogout} data-testid="button-logout">
              Sign Out
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/20 bg-destructive/5">
            <div className="flex items-center gap-3">
              <Trash2 className="h-5 w-5 text-destructive" />
              <div>
                <p className="font-medium text-destructive">Delete Account</p>
                <p className="text-sm text-muted-foreground">Permanently delete your account and data</p>
              </div>
            </div>
            <Button variant="destructive" data-testid="button-delete-account">
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
