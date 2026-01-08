import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check, Building2, Landmark, FileCheck, PartyPopper } from "lucide-react";
import { TitherLogo } from "./Logo";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

const steps = [
  { id: 1, label: "Organization", icon: Building2 },
  { id: 2, label: "Verification", icon: FileCheck },
  { id: 3, label: "Bank Account", icon: Landmark },
  { id: 4, label: "Complete", icon: PartyPopper },
];

interface OnboardingWizardProps {
  onComplete: (data: { name: string; slug: string }) => void;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 50);
}

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [orgName, setOrgName] = useState("");
  const [orgType, setOrgType] = useState("");
  const [ein, setEin] = useState("");
  const [address, setAddress] = useState("");

  const createOrgMutation = useMutation({
    mutationFn: async (data: { name: string; type: string; address: string; ein: string; slug: string }) => {
      const response = await apiRequest("POST", "/api/onboarding/complete", data);
      return response.json();
    },
    onSuccess: () => {
      onComplete({ name: orgName, slug: generateSlug(orgName) });
    }
  });

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      createOrgMutation.mutate({
        name: orgName,
        type: orgType,
        address,
        ein,
        slug: generateSlug(orgName)
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="h-16 border-b flex items-center justify-center">
        <TitherLogo />
      </header>

      <div className="flex-1 flex flex-col items-center px-6 py-12">
        <div className="w-full max-w-2xl">
          <div className="flex items-center justify-center gap-4 mb-12">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                      currentStep > step.id
                        ? "bg-primary border-primary text-primary-foreground"
                        : currentStep === step.id
                        ? "border-primary text-primary"
                        : "border-muted text-muted-foreground"
                    }`}
                    data-testid={`step-indicator-${step.id}`}
                  >
                    {currentStep > step.id ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <step.icon className="h-5 w-5" />
                    )}
                  </div>
                  <span className={`mt-2 text-xs font-medium ${currentStep >= step.id ? "text-foreground" : "text-muted-foreground"}`}>
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 mt-[-1.5rem] ${currentStep > step.id ? "bg-primary" : "bg-muted"}`} />
                )}
              </div>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-2xl">
                {currentStep === 1 && "Tell us about your organization"}
                {currentStep === 2 && "Verify your organization"}
                {currentStep === 3 && "Connect your bank account"}
                {currentStep === 4 && "You're all set!"}
              </CardTitle>
              <CardDescription>
                {currentStep === 1 && "We'll use this information to set up your giving page."}
                {currentStep === 2 && "This helps donors trust that their gifts go to the right place."}
                {currentStep === 3 && "Donations will be deposited directly into this account."}
                {currentStep === 4 && "Your giving page is ready to accept donations."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentStep === 1 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="orgName">Organization Name</Label>
                    <Input
                      id="orgName"
                      placeholder="St. Mary's Catholic Church"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      data-testid="input-org-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="orgType">Organization Type</Label>
                    <Input
                      id="orgType"
                      placeholder="Parish, Diocese, or Catholic Organization"
                      value={orgType}
                      onChange={(e) => setOrgType(e.target.value)}
                      data-testid="input-org-type"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      placeholder="123 Main Street, City, State ZIP"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      data-testid="input-address"
                    />
                  </div>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="ein">EIN / Tax ID</Label>
                    <Input
                      id="ein"
                      placeholder="XX-XXXXXXX"
                      value={ein}
                      onChange={(e) => setEin(e.target.value)}
                      data-testid="input-ein"
                    />
                    <p className="text-xs text-muted-foreground">
                      Your Employer Identification Number for tax-deductible donations.
                    </p>
                  </div>
                  <div className="rounded-lg border p-4 bg-muted/50">
                    <p className="text-sm text-muted-foreground">
                      Verification typically takes 1-2 business days. You can continue setting up your giving page while we verify your organization.
                    </p>
                  </div>
                </>
              )}

              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="rounded-lg border p-6 text-center">
                    <Landmark className="h-12 w-12 mx-auto text-primary mb-4" />
                    <p className="font-medium mb-2">Connect with Tither Pay</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Securely link your bank account. Deposits typically arrive in 3-5 business days.
                    </p>
                    <Button onClick={handleNext} data-testid="button-connect-bank">
                      Connect Bank Account
                    </Button>
                  </div>
                  <p className="text-xs text-center text-muted-foreground">
                    Powered by Tither Pay. Your banking information is encrypted and secure.
                  </p>
                </div>
              )}

              {currentStep === 4 && (
                <div className="text-center py-6">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-chart-2/10 text-chart-2 mx-auto mb-6">
                    <PartyPopper className="h-12 w-12" />
                  </div>
                  <p className="text-lg font-medium mb-2">Congratulations!</p>
                  <p className="text-muted-foreground mb-6">
                    Your organization is set up and ready to receive donations. Share your giving page to start collecting gifts.
                  </p>
                </div>
              )}

              <div className="flex justify-between pt-4">
                {currentStep > 1 && currentStep !== 3 && (
                  <Button variant="outline" onClick={handleBack} data-testid="button-back">
                    Back
                  </Button>
                )}
                {currentStep === 3 ? (
                  <div />
                ) : (
                  <Button 
                    onClick={handleNext} 
                    className="ml-auto" 
                    data-testid="button-next"
                    disabled={createOrgMutation.isPending}
                  >
                    {createOrgMutation.isPending ? "Creating..." : currentStep === 4 ? "Go to Dashboard" : "Continue"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
