import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Heart } from "lucide-react";
import { TitherLogo } from "./Logo";

interface RoleSelectionProps {
  onSelectRole: (role: "organization" | "donor") => void;
}

export function RoleSelection({ onSelectRole }: RoleSelectionProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="h-16 border-b flex items-center justify-center">
        <TitherLogo />
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl text-center">
          <h1 className="font-heading text-3xl font-bold mb-2" data-testid="text-welcome-title">
            Welcome to Tither
          </h1>
          <p className="text-muted-foreground mb-8">
            How would you like to use Tither today?
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <Card 
              className="hover-elevate cursor-pointer transition-all border-2 hover:border-primary"
              onClick={() => onSelectRole("organization")}
              data-testid="card-role-organization"
            >
              <CardHeader className="text-center pb-2">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mx-auto mb-4">
                  <Building2 className="h-8 w-8" />
                </div>
                <CardTitle className="font-heading text-xl">I'm an Organization</CardTitle>
                <CardDescription>
                  Set up your giving page and manage donations
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="text-sm text-muted-foreground space-y-2 text-left">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Create custom giving pages
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Manage donation funds
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Track donors and gifts
                  </li>
                </ul>
                <Button className="w-full mt-6" data-testid="button-continue-org">
                  Continue as Organization
                </Button>
              </CardContent>
            </Card>

            <Card 
              className="hover-elevate cursor-pointer transition-all border-2 hover:border-primary"
              onClick={() => onSelectRole("donor")}
              data-testid="card-role-donor"
            >
              <CardHeader className="text-center pb-2">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent mx-auto mb-4">
                  <Heart className="h-8 w-8" />
                </div>
                <CardTitle className="font-heading text-xl">I'm a Donor</CardTitle>
                <CardDescription>
                  Give to your favorite causes and track your gifts
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="text-sm text-muted-foreground space-y-2 text-left">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    Easy one-time or recurring gifts
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    Track your giving history
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    Download tax receipts
                  </li>
                </ul>
                <Button variant="secondary" className="w-full mt-6" data-testid="button-continue-donor">
                  Continue as Donor
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
