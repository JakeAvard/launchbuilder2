import { useState, useEffect, createContext, useContext } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TopNav } from "@/components/TopNav";
import { Dashboard } from "@/components/Dashboard";
import { GivingPageEditor } from "@/components/GivingPageEditor";
import { DonorsList } from "@/components/DonorsList";
import { SettingsPage } from "@/components/SettingsPage";
import { SupportPage } from "@/components/SupportPage";
import { OnboardingWizard } from "@/components/OnboardingWizard";
import { SuccessScreen } from "@/components/SuccessScreen";
import { PublicGivingPage } from "@/components/PublicGivingPage";
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

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main>{children}</main>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/giving-page" component={GivingPageEditor} />
      <Route path="/donors" component={DonorsList} />
      <Route path="/settings" component={SettingsPage} />
      <Route path="/support" component={SupportPage} />
      <Route path="/give/:slug" component={PublicGivingPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState<{ name: string; slug: string } | null>(null);

  const { data: organization, isLoading, refetch } = useQuery<Organization>({
    queryKey: ["/api/current-organization"],
  });

  const handleOnboardingComplete = (data: { name: string; slug: string }) => {
    setSuccessData(data);
    setShowSuccess(true);
  };

  const handleDismissSuccess = () => {
    setShowSuccess(false);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!organization && !showSuccess) {
    return <OnboardingWizard onComplete={handleOnboardingComplete} />;
  }

  if (showSuccess && successData) {
    return (
      <SuccessScreen
        organizationName={successData.name}
        givingPageUrl={`https://tither.app/give/${successData.slug}`}
        onDismiss={handleDismissSuccess}
      />
    );
  }

  return (
    <OrganizationContext.Provider value={{ organization: organization || null, refetch }}>
      <AdminLayout>
        <Router />
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
