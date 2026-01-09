import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TitherLogo } from "./Logo";
import { ArrowLeft } from "lucide-react";

interface OrganizationSignupProps {
  onComplete: (data: { email: string; password: string }) => void;
  onBack: () => void;
}

export function OrganizationSignup({ onComplete, onBack }: OrganizationSignupProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const passwordsMatch = formData.password === formData.confirmPassword;
  const isValid = formData.email.includes("@") && formData.password.length >= 6 && passwordsMatch;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match");
      return;
    }

    onComplete({ email: formData.email, password: formData.password });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="h-16 border-b flex items-center justify-between px-6">
        <TitherLogo />
        <Button variant="ghost" onClick={onBack} data-testid="button-back-to-selection">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="font-heading text-2xl">Create Your Account</CardTitle>
              <CardDescription>
                Enter your credentials to get started with Tither
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@yourchurch.org"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    data-testid="input-org-email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Min. 6 characters"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    data-testid="input-org-password"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className={formData.confirmPassword && !passwordsMatch ? "border-destructive" : ""}
                    data-testid="input-org-confirm-password"
                  />
                </div>

                {formData.confirmPassword && !passwordsMatch && (
                  <p className="text-sm text-destructive">Passwords do not match</p>
                )}

                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={!isValid}
                  data-testid="button-create-account"
                >
                  Create Account & Continue
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Button variant="ghost" className="p-0 h-auto underline" data-testid="button-login-link">
                    Sign in
                  </Button>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
