import { useState, useEffect, createContext, useContext } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TopNav } from "@/components/TopNav";
import { DonorTopNav } from "@/components/DonorTopNav";
import { Dashboard } from "@/components/Dashboard";
import { GivingPageEditor } from "@/components/GivingPageEditor";
import { DonorsList } from "@/components/DonorsList";
import { SettingsPage } from "@/components/SettingsPage";
import { SupportPage } from "@/components/SupportPage";
import { OnboardingWizard } from "@/components/OnboardingWizard";
import { SuccessScreen } from "@/components/SuccessScreen";
import { PublicGivingPage } from "@/components/PublicGivingPage";
import { RoleSelection } from "@/components/RoleSelection";
import { DonorDashboard } from "@/components/DonorDashboard";
import { DonorOnboarding } from "@/components/DonorOnboarding";
import { DonorGivingDashboard } from "@/components/DonorGivingDashboard";
import { DonorSettingsPage } from "@/components/DonorSettingsPage";
import { OrganizationSignup } from "@/components/OrganizationSignup";
import { OrganizationDetailPage } from "@/components/OrganizationDetailPage";
import NotFound from "@/pages/not-found";
import type { Organization } from "@shared/schema";

interface OrganizationContextType {
  organization: Organization | null;
  refetch: () => void;
}

const OrganizationContext = createContext<OrganizationContextType>({
  organization: null,
  refetch: () => {}
});

export function useOrganization() {
  return useContext(OrganizationContext);
}

type UserRole = "organization" | "donor" | null;

function AdminLayout({ children, onLogout }: { children: React.ReactNode; onLogout: () => void }) {
  return (
    <div className="min-h-screen bg-background">
      <TopNav onLogout={onLogout} />
      <main>{children}</main>
    </div>
  );
}

function DonorLayout({ children, onLogout }: { children: React.ReactNode; onLogout: () => void }) {
  return (
    <div className="min-h-screen bg-background">
      <DonorTopNav onLogout={onLogout} />
      <main>{children}</main>
    </div>
  );
}

function OrgRouter() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/giving-page" component={GivingPageEditor} />
      <Route path="/donors" component={DonorsList} />
      <Route path="/settings" component={SettingsPage} />
      <Route path="/support" component={SupportPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function DonorRouter({ onLogout }: { onLogout: () => void }) {
  return (
    <Switch>
      <Route path="/donor">
        <DonorDashboard onLogout={onLogout} />
      </Route>
      <Route path="/donor/giving">
        <DonorGivingDashboard />
      </Route>
      <Route path="/donor/settings">
        <DonorSettingsPage onLogout={onLogout} />
      </Route>
      <Route path="/donor/support">
        <SupportPage />
      </Route>
      <Route path="/org/:slug" component={OrganizationDetailPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { toast } = useToast();
  const [role, setRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem("tither_role");
    return saved as UserRole;
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState<{ name: string; slug: string } | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [donorOnboarded, setDonorOnboarded] = useState(() => {
    return localStorage.getItem("tither_donor_onboarded") === "true";
  });
  const [showOrgSignup, setShowOrgSignup] = useState(false);
  const [, setLocation] = useLocation();

  const { data: organization, isLoading, refetch } = useQuery<Organization>({
    queryKey: ["/api/current-organization"],
    enabled: role === "organization",
  });

  useEffect(() => {
    if (role) {
      localStorage.setItem("tither_role", role);
    }
  }, [role]);

  const handleRoleSelect = (selectedRole: "organization" | "donor") => {
    if (selectedRole === "organization") {
      setShowOrgSignup(true);
    } else {
      setRole(selectedRole);
      setLocation("/donor");
    }
  };

  const handleOrgSignupComplete = (_data: { email: string; password: string }) => {
    localStorage.setItem("tither_org_signed_up", "true");
    setShowOrgSignup(false);
    setRole("organization");
  };

  const handleBackToSelection = () => {
    setShowOrgSignup(false);
  };

  const handleOnboardingComplete = (data: { name: string; slug: string }) => {
    setSuccessData(data);
    setShowSuccess(true);
  };

  const handleDismissSuccess = async () => {
    setIsTransitioning(true);
    try {
      const result = await refetch();
      if (result.data) {
        setShowSuccess(false);
        setIsTransitioning(false);
        setLocation("/");
      } else {
        throw new Error("No organization data returned");
      }
    } catch (e) {
      console.error("Failed to fetch organization data:", e);
      setIsTransitioning(false);
      toast({
        title: "Error loading dashboard",
        description: "Please try again or refresh the page.",
        variant: "destructive",
      });
    }
  };

  const handleDonorOnboarding = () => {
    localStorage.setItem("tither_donor_onboarded", "true");
    setDonorOnboarded(true);
    setLocation("/donor");
  };

  const handleSkipDonorOnboarding = () => {
    localStorage.setItem("tither_donor_onboarded", "true");
    setDonorOnboarded(true);
    setLocation("/donor");
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
    } catch (e) {
      // Continue with client-side logout even if server fails
    }
    localStorage.removeItem("tither_role");
    localStorage.removeItem("tither_donor_onboarded");
    localStorage.removeItem("tither_org_signed_up");
    setRole(null);
    setDonorOnboarded(false);
    setShowOrgSignup(false);
    setShowSuccess(false);
    setSuccessData(null);
    queryClient.clear();
    setLocation("/");
  };

  if ((isLoading || isTransitioning) && role === "organization") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!role) {
    if (showOrgSignup) {
      return (
        <Switch>
          <Route path="/give/:slug" component={PublicGivingPage} />
          <Route>
            <OrganizationSignup onComplete={handleOrgSignupComplete} onBack={handleBackToSelection} />
          </Route>
        </Switch>
      );
    }
    return (
      <Switch>
        <Route path="/give/:slug" component={PublicGivingPage} />
        <Route>
          <RoleSelection onSelectRole={handleRoleSelect} />
        </Route>
      </Switch>
    );
  }

  if (role === "donor") {
    if (!donorOnboarded) {
      return (
        <Switch>
          <Route path="/give/:slug" component={PublicGivingPage} />
          <Route>
            <DonorOnboarding onComplete={handleDonorOnboarding} onSkip={handleSkipDonorOnboarding} />
          </Route>
        </Switch>
      );
    }
    return (
      <DonorLayout onLogout={handleLogout}>
        <Switch>
          <Route path="/give/:slug" component={PublicGivingPage} />
          <Route>
            <DonorRouter onLogout={handleLogout} />
          </Route>
        </Switch>
      </DonorLayout>
    );
  }

  if (!organization && !showSuccess) {
    return (
      <Switch>
        <Route path="/give/:slug" component={PublicGivingPage} />
        <Route>
          <OnboardingWizard onComplete={handleOnboardingComplete} />
        </Route>
      </Switch>
    );
  }

  if (showSuccess && successData) {
    return (
      <SuccessScreen
        organizationName={successData.name}
        givingPageUrl={`https://tither.us/give/${successData.slug}`}
        onDismiss={handleDismissSuccess}
      />
    );
  }

  return (
    <OrganizationContext.Provider value={{ organization: organization || null, refetch }}>
      <AdminLayout onLogout={handleLogout}>
        <Switch>
          <Route path="/give/:slug" component={PublicGivingPage} />
          <Route>
            <OrgRouter />
          </Route>
        </Switch>
      </AdminLayout>
    </OrganizationContext.Provider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppContent />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
