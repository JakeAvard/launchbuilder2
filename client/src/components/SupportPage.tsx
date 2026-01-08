import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  MessageCircle, 
  FileText, 
  Video, 
  Mail,
  ExternalLink,
  Search,
  BookOpen,
  HelpCircle,
  ChevronRight
} from "lucide-react";

const helpArticles = [
  { title: "Getting Started with Tither", category: "Setup", icon: BookOpen },
  { title: "How to Connect Your Bank Account", category: "Payments", icon: FileText },
  { title: "Customizing Your Giving Page", category: "Giving Page", icon: FileText },
  { title: "Understanding Processing Fees", category: "Payments", icon: HelpCircle },
  { title: "Sending Donor Receipts", category: "Receipts", icon: Mail },
  { title: "Adding Team Members", category: "Settings", icon: FileText },
];

export function SupportPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold" data-testid="text-support-title">Support</h1>
        <p className="text-muted-foreground">Get help with your Tither account.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">How can we help?</CardTitle>
              <CardDescription>
                Search our help center or browse common topics.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search for help..."
                  className="pl-10 h-12"
                  data-testid="input-search-help"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: "Live Chat", icon: MessageCircle, description: "Chat with our team" },
                  { label: "Video Tutorials", icon: Video, description: "Watch how-to guides" },
                  { label: "Documentation", icon: FileText, description: "Browse all articles" },
                ].map((item) => (
                  <Card key={item.label} className="hover-elevate cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mx-auto mb-4">
                        <item.icon className="h-6 w-6" />
                      </div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Popular Articles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {helpArticles.map((article, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 border rounded-lg hover-elevate cursor-pointer"
                    data-testid={`row-article-${i}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <article.icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{article.title}</p>
                        <p className="text-sm text-muted-foreground">{article.category}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Contact Us
              </CardTitle>
              <CardDescription>
                Send us a message and we'll get back to you.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="How can we help?" data-testid="input-contact-subject" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  rows={4}
                  placeholder="Describe your question or issue..."
                  data-testid="input-contact-message"
                />
              </div>
              <Button className="w-full" data-testid="button-send-message">
                Send Message
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Office Hours</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monday - Friday</span>
                <span>9:00 AM - 6:00 PM ET</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Saturday</span>
                <span>10:00 AM - 2:00 PM ET</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sunday</span>
                <span>Closed</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
