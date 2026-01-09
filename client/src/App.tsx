import { useState, useEffect, createContext, useContext } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
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
        <DonorDashboard onLogout={onLogout} />
      </Route>
      <Route path="/donor/settings">
        <DonorDashboard onLogout={onLogout} />
      </Route>
      <Route path="/donor/support">
        <SupportPage />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const [role, setRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem("tither_role");
    return saved as UserRole;
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState<{ name: string; slug: string } | null>(null);
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
    setRole(selectedRole);
    if (selectedRole === "donor") {
      setLocation("/donor");
    }
  };

  const handleOnboardingComplete = (data: { name: string; slug: string }) => {
    setSuccessData(data);
    setShowSuccess(true);
  };

  const handleDismissSuccess = async () => {
    setShowSuccess(false);
    await refetch();
    setLocation("/");
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
    } catch (e) {
      // Continue with client-side logout even if server fails
    }
    localStorage.removeItem("tither_role");
    setRole(null);
    setShowSuccess(false);
    setSuccessData(null);
    queryClient.clear();
    setLocation("/");
  };

  if (isLoading && role === "organization") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!role) {
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
