import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, User, CreditCard, Bell, PartyPopper } from "lucide-react";
import { TitherLogo } from "./Logo";
import { Switch } from "@/components/ui/switch";

const steps = [
  { id: 1, label: "Profile", icon: User },
  { id: 2, label: "Payment", icon: CreditCard },
  { id: 3, label: "Preferences", icon: Bell },
  { id: 4, label: "Complete", icon: PartyPopper },
];

interface DonorOnboardingProps {
  onComplete: () => void;
  onSkip: () => void;
}

export function DonorOnboarding({ onComplete, onSkip }: DonorOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    enableRoundUp: true,
    roundUpAmount: "5",
    emailReceipts: true,
    monthlyReport: true,
    givingReminders: false,
  });

  const canSkip = formData.email.includes("@") && formData.password.length >= 6;
  const passwordsMatch = formData.password === formData.confirmPassword;

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateForm = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="h-16 border-b flex items-center justify-between px-6">
        <TitherLogo />
        <Button 
          variant="ghost" 
          onClick={onSkip} 
          disabled={!canSkip}
          data-testid="button-skip-onboarding"
        >
          {canSkip ? "Set up later" : "Enter email & password to skip"}
        </Button>
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
                    data-testid={`donor-step-indicator-${step.id}`}
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
                {currentStep === 1 && "Tell us about yourself"}
                {currentStep === 2 && "Set up Round Up for Good"}
                {currentStep === 3 && "Communication preferences"}
                {currentStep === 4 && "You're all set!"}
              </CardTitle>
              <CardDescription>
                {currentStep === 1 && "We'll use this to personalize your giving experience."}
                {currentStep === 2 && "Round up your donations to make an even bigger impact."}
                {currentStep === 3 && "Choose how you'd like to hear from us."}
                {currentStep === 4 && "Your donor profile is ready. Start making a difference!"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentStep === 1 && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) => updateForm("firstName", e.target.value)}
                        data-testid="input-first-name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Smith"
                        value={formData.lastName}
                        onChange={(e) => updateForm("lastName", e.target.value)}
                        data-testid="input-last-name"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address <span className="text-destructive">*</span></Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => updateForm("email", e.target.value)}
                      data-testid="input-email"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password <span className="text-destructive">*</span></Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Min. 6 characters"
                        value={formData.password}
                        onChange={(e) => updateForm("password", e.target.value)}
                        data-testid="input-password"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password <span className="text-destructive">*</span></Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={(e) => updateForm("confirmPassword", e.target.value)}
                        className={formData.confirmPassword && !passwordsMatch ? "border-destructive" : ""}
                        data-testid="input-confirm-password"
                      />
                    </div>
                  </div>
                  {formData.confirmPassword && !passwordsMatch && (
                    <p className="text-sm text-destructive">Passwords do not match</p>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number (optional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => updateForm("phone", e.target.value)}
                      data-testid="input-phone"
                    />
                  </div>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <div className="flex items-center justify-between p-4 rounded-lg border bg-primary/5">
                    <div className="space-y-1">
                      <p className="font-medium">Enable Round Up for Good</p>
                      <p className="text-sm text-muted-foreground">
                        Automatically round up your donations to the nearest dollar amount
                      </p>
                    </div>
                    <Switch
                      checked={formData.enableRoundUp}
                      onCheckedChange={(checked) => updateForm("enableRoundUp", checked)}
                      data-testid="switch-enable-roundup"
                    />
                  </div>

                  {formData.enableRoundUp && (
                    <div className="space-y-4">
                      <Label>Round up to nearest:</Label>
                      <div className="grid grid-cols-3 gap-3">
                        {["1", "5", "10"].map((amount) => (
                          <Button
                            key={amount}
                            type="button"
                            variant={formData.roundUpAmount === amount ? "default" : "outline"}
                            className="h-16 text-lg"
                            onClick={() => updateForm("roundUpAmount", amount)}
                            data-testid={`button-roundup-${amount}`}
                          >
                            ${amount}
                          </Button>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground text-center">
                        Example: A $47 donation becomes ${Math.ceil(47 / parseInt(formData.roundUpAmount)) * parseInt(formData.roundUpAmount)}
                      </p>
                    </div>
                  )}

                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-center text-muted-foreground">
                      You can change these settings anytime from your dashboard
                    </p>
                  </div>
                </>
              )}

              {currentStep === 3 && (
                <>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="space-y-1">
                        <p className="font-medium">Email receipts</p>
                        <p className="text-sm text-muted-foreground">
                          Receive a receipt after each donation
                        </p>
                      </div>
                      <Switch
                        checked={formData.emailReceipts}
                        onCheckedChange={(checked) => updateForm("emailReceipts", checked)}
                        data-testid="switch-email-receipts"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="space-y-1">
                        <p className="font-medium">Monthly giving report</p>
                        <p className="text-sm text-muted-foreground">
                          Summary of your monthly donations
                        </p>
                      </div>
                      <Switch
                        checked={formData.monthlyReport}
                        onCheckedChange={(checked) => updateForm("monthlyReport", checked)}
                        data-testid="switch-monthly-report"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="space-y-1">
                        <p className="font-medium">Giving reminders</p>
                        <p className="text-sm text-muted-foreground">
                          Gentle nudges to keep up your giving
                        </p>
                      </div>
                      <Switch
                        checked={formData.givingReminders}
                        onCheckedChange={(checked) => updateForm("givingReminders", checked)}
                        data-testid="switch-giving-reminders"
                      />
                    </div>
                  </div>
                </>
              )}

              {currentStep === 4 && (
                <div className="text-center py-8">
                  <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-full bg-primary/10 text-primary mb-6">
                    <PartyPopper className="h-10 w-10" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold mb-2">
                    Welcome to Tither, {formData.firstName || "Donor"}!
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Your profile is set up and you're ready to start making a difference.
                    Track your giving, discover new causes, and manage everything from your dashboard.
                  </p>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="text-2xl font-bold text-primary">$0</p>
                      <p className="text-xs text-muted-foreground">Total Given</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="text-2xl font-bold text-primary">0</p>
                      <p className="text-xs text-muted-foreground">Organizations</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="text-2xl font-bold text-primary">{formData.enableRoundUp ? "ON" : "OFF"}</p>
                      <p className="text-xs text-muted-foreground">Round Up</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-between mt-8">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 1}
              data-testid="button-back"
            >
              Back
            </Button>
            <Button onClick={handleNext} data-testid="button-next">
              {currentStep === 4 ? "Go to Dashboard" : "Continue"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
