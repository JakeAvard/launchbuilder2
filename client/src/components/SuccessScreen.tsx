import { QRCodeSVG } from "qrcode.react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, Image, FileText, Palette } from "lucide-react";
import { useState } from "react";
import { Mascot } from "./Mascot";

interface SuccessScreenProps {
  organizationName: string;
  givingPageUrl: string;
  onDismiss: () => void;
}

export function SuccessScreen({ organizationName, givingPageUrl, onDismiss }: SuccessScreenProps) {
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(givingPageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const nextSteps = [
    { icon: Image, label: "Add your logo", description: "Upload your parish or organization logo" },
    { icon: FileText, label: "Write your About Us", description: "Tell donors about your mission" },
    { icon: Palette, label: "Customize your page", description: "Add content modules and campaigns" },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8">
          <Mascot size="lg" className="mx-auto mb-6" />
          <h1 className="font-heading text-4xl font-bold mb-2" data-testid="text-success-headline">
            Your giving page is live!
          </h1>
          <p className="text-lg text-muted-foreground">
            {organizationName} can now accept donations online.
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <div className="bg-white p-4 rounded-lg">
                <QRCodeSVG value={givingPageUrl} size={160} data-testid="img-qr-code" />
              </div>
              <div className="text-left">
                <p className="text-sm text-muted-foreground mb-2">Your giving page link:</p>
                <div className="flex items-center gap-2 mb-4">
                  <code className="flex-1 bg-muted px-3 py-2 rounded-md text-sm break-all" data-testid="text-giving-url">
                    {givingPageUrl}
                  </code>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={copyLink} variant="outline" size="sm" data-testid="button-copy-link">
                    {copied ? <Copy className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    {copied ? "Copied!" : "Copy link"}
                  </Button>
                  <Button variant="outline" size="sm" asChild data-testid="button-view-page">
                    <a href={givingPageUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View page
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-8">
          <h2 className="font-heading text-xl font-semibold mb-4">Recommended next steps</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {nextSteps.map((step) => (
              <Card key={step.label} className="hover-elevate cursor-pointer">
                <CardContent className="p-6 text-left">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                    <step.icon className="h-5 w-5" />
                  </div>
                  <p className="font-medium mb-1">{step.label}</p>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Button onClick={onDismiss} size="lg" data-testid="button-go-dashboard">
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}
