import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  Eye, 
  Save, 
  Image, 
  Type, 
  DollarSign, 
  Plus,
  GripVertical,
  Trash2,
  ExternalLink,
  Cross,
  Copy,
  Palette,
  Target,
  Heart,
  Sparkles,
  X,
  RefreshCw,
  UserX
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useOrganization } from "@/App";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Fund } from "@shared/schema";

export function GivingPageEditor() {
  const { organization, refetch: refetchOrg } = useOrganization();
  const { toast } = useToast();
  
  const [orgName, setOrgName] = useState("");
  const [aboutText, setAboutText] = useState("");
  const [newFundName, setNewFundName] = useState("");
  
  // New customization state
  const [buttonText, setButtonText] = useState("Give Now");
  const [thankYouMessage, setThankYouMessage] = useState("");
  const [suggestedAmounts, setSuggestedAmounts] = useState<string[]>(["25", "50", "100", "250"]);
  const [newAmount, setNewAmount] = useState("");
  const [enableRecurring, setEnableRecurring] = useState(true);
  const [enableAnonymous, setEnableAnonymous] = useState(true);
  const [buttonStyle, setButtonStyle] = useState("rounded");
  const [backgroundPattern, setBackgroundPattern] = useState("none");
  const [primaryColor, setPrimaryColor] = useState("#7c3aed");
  const [accentColor, setAccentColor] = useState("#f59e0b");
  const [showGoalMeter, setShowGoalMeter] = useState(false);
  const [goalAmount, setGoalAmount] = useState("");
  const [enableRoundUp, setEnableRoundUp] = useState(true);

  useEffect(() => {
    if (organization) {
      setOrgName(organization.name);
      setAboutText(organization.aboutText || "");
      setButtonText(organization.buttonText || "Give Now");
      setThankYouMessage(organization.thankYouMessage || "");
      setSuggestedAmounts(organization.suggestedAmounts || ["25", "50", "100", "250"]);
      setEnableRecurring(organization.enableRecurring ?? true);
      setEnableAnonymous(organization.enableAnonymous ?? true);
      setButtonStyle(organization.buttonStyle || "rounded");
      setBackgroundPattern(organization.backgroundPattern || "none");
      setPrimaryColor(organization.primaryColor || "#7c3aed");
      setAccentColor(organization.accentColor || "#f59e0b");
      setShowGoalMeter(organization.showGoalMeter ?? false);
      setGoalAmount(organization.goalAmount || "");
      setEnableRoundUp(organization.enableRoundUp ?? true);
    }
  }, [organization]);

  const { data: funds, isLoading: fundsLoading } = useQuery<Fund[]>({
    queryKey: ["/api/organization", organization?.id, "funds"],
    enabled: !!organization?.id,
  });

  const updateOrgMutation = useMutation({
    mutationFn: async (data: Partial<{
      name: string;
      aboutText: string;
      buttonText: string;
      thankYouMessage: string;
      suggestedAmounts: string[];
      enableRecurring: boolean;
      enableAnonymous: boolean;
      buttonStyle: string;
      backgroundPattern: string;
      primaryColor: string;
      accentColor: string;
      showGoalMeter: boolean;
      goalAmount: string | null;
      enableRoundUp: boolean;
    }>) => {
      const response = await apiRequest("PATCH", `/api/organization/${organization?.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      refetchOrg();
      toast({ title: "Changes saved successfully" });
    }
  });

  const toggleFundMutation = useMutation({
    mutationFn: async ({ id, enabled }: { id: string; enabled: boolean }) => {
      const response = await apiRequest("PATCH", `/api/funds/${id}`, { enabled });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/organization", organization?.id, "funds"] });
    }
  });

  const addFundMutation = useMutation({
    mutationFn: async (name: string) => {
      const response = await apiRequest("POST", `/api/organization/${organization?.id}/funds`, { name, enabled: true });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/organization", organization?.id, "funds"] });
      setNewFundName("");
      toast({ title: "Fund added successfully" });
    }
  });

  const deleteFundMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/funds/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/organization", organization?.id, "funds"] });
      toast({ title: "Fund deleted" });
    }
  });

  const handleSave = () => {
    updateOrgMutation.mutate({ 
      name: orgName, 
      aboutText,
      buttonText,
      thankYouMessage,
      suggestedAmounts,
      enableRecurring,
      enableAnonymous,
      buttonStyle,
      backgroundPattern,
      primaryColor,
      accentColor,
      showGoalMeter,
      goalAmount: goalAmount || null,
      enableRoundUp
    });
  };

  const handleAddAmount = () => {
    const amount = newAmount.replace(/[^0-9]/g, "");
    if (amount && !suggestedAmounts.includes(amount)) {
      setSuggestedAmounts([...suggestedAmounts, amount].sort((a, b) => parseInt(a) - parseInt(b)));
      setNewAmount("");
    }
  };

  const handleRemoveAmount = (amount: string) => {
    setSuggestedAmounts(suggestedAmounts.filter(a => a !== amount));
  };

  const handleAddFund = () => {
    if (newFundName.trim()) {
      addFundMutation.mutate(newFundName.trim());
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(givingPageUrl);
    toast({ title: "URL copied to clipboard" });
  };

  const givingPageUrl = `https://tither.app/give/${organization?.slug || ""}`;
  const fundList = funds || [];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold" data-testid="text-giving-page-title">Giving Page</h1>
          <p className="text-muted-foreground">Customize how your giving page looks to donors.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="gap-2" data-testid="button-preview">
            <Eye className="h-4 w-4" />
            Preview
          </Button>
          <Button 
            className="gap-2" 
            data-testid="button-save-changes" 
            onClick={handleSave}
            disabled={updateOrgMutation.isPending}
          >
            <Save className="h-4 w-4" />
            {updateOrgMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="content">
            <TabsList>
              <TabsTrigger value="content" data-testid="tab-content">Content</TabsTrigger>
              <TabsTrigger value="funds" data-testid="tab-funds">Funds</TabsTrigger>
              <TabsTrigger value="design" data-testid="tab-design">Design</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading flex items-center gap-2">
                    <Image className="h-5 w-5" />
                    Logo & Header
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <Image className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload your organization logo
                    </p>
                    <Button variant="outline" data-testid="button-upload-logo">
                      Choose File
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="orgName">Organization Name</Label>
                    <Input
                      id="orgName"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      data-testid="input-org-name"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-heading flex items-center gap-2">
                    <Type className="h-5 w-5" />
                    About Your Organization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    rows={5}
                    value={aboutText}
                    onChange={(e) => setAboutText(e.target.value)}
                    placeholder="Tell donors about your mission and how their gifts make an impact..."
                    data-testid="input-about-text"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    This appears on your public giving page.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="funds" className="space-y-6 mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-4">
                  <div>
                    <CardTitle className="font-heading flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Giving Funds
                    </CardTitle>
                    <CardDescription>
                      Configure which funds donors can give to.
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 mb-4">
                    <Input
                      placeholder="New fund name..."
                      value={newFundName}
                      onChange={(e) => setNewFundName(e.target.value)}
                      data-testid="input-new-fund"
                    />
                    <Button 
                      variant="outline" 
                      className="gap-2" 
                      data-testid="button-add-fund"
                      onClick={handleAddFund}
                      disabled={addFundMutation.isPending || !newFundName.trim()}
                    >
                      <Plus className="h-4 w-4" />
                      Add
                    </Button>
                  </div>
                  
                  {fundsLoading ? (
                    <div className="text-center py-8 text-muted-foreground">Loading funds...</div>
                  ) : (
                    <div className="space-y-2">
                      {fundList.map((fund) => (
                        <div
                          key={fund.id}
                          className="flex items-center justify-between gap-4 p-4 border rounded-lg"
                          data-testid={`row-fund-${fund.id}`}
                        >
                          <div className="flex items-center gap-3">
                            <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                            <span className="font-medium">{fund.name}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <Switch
                              checked={fund.enabled || false}
                              onCheckedChange={(enabled) => toggleFundMutation.mutate({ id: fund.id, enabled })}
                              data-testid={`switch-fund-${fund.id}`}
                            />
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              data-testid={`button-delete-fund-${fund.id}`}
                              onClick={() => deleteFundMutation.mutate(fund.id)}
                            >
                              <Trash2 className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="design" className="space-y-6 mt-6">
              {/* Suggested Donation Amounts */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Suggested Amounts
                  </CardTitle>
                  <CardDescription>
                    Set the donation amounts donors can quickly select.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {suggestedAmounts.map((amount) => (
                      <div
                        key={amount}
                        className="flex items-center gap-1 bg-secondary px-3 py-1.5 rounded-full"
                      >
                        <span className="font-medium">${amount}</span>
                        <button
                          onClick={() => handleRemoveAmount(amount)}
                          className="text-muted-foreground hover:text-foreground"
                          data-testid={`button-remove-amount-${amount}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="pl-8"
                        placeholder="Add amount..."
                        value={newAmount}
                        onChange={(e) => setNewAmount(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAddAmount()}
                        data-testid="input-new-amount"
                      />
                    </div>
                    <Button variant="outline" onClick={handleAddAmount} data-testid="button-add-amount">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Button & Text Customization */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Button & Messages
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Donate Button Text</Label>
                    <Input
                      value={buttonText}
                      onChange={(e) => setButtonText(e.target.value)}
                      placeholder="Give Now"
                      data-testid="input-button-text"
                    />
                    <p className="text-xs text-muted-foreground">
                      Try: "Make a Difference", "Support Our Mission", "Give with Love"
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Thank You Message</Label>
                    <Textarea
                      value={thankYouMessage}
                      onChange={(e) => setThankYouMessage(e.target.value)}
                      placeholder="Thank you for your generous gift!"
                      rows={3}
                      data-testid="input-thank-you-message"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Button Style</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: "rounded", label: "Rounded" },
                        { value: "pill", label: "Pill" },
                        { value: "square", label: "Square" }
                      ].map((style) => (
                        <button
                          key={style.value}
                          onClick={() => setButtonStyle(style.value)}
                          className={`p-3 border-2 transition-colors ${
                            buttonStyle === style.value 
                              ? "border-primary bg-primary/5" 
                              : "border-border hover:border-primary/50"
                          }`}
                          style={{ 
                            borderRadius: style.value === "pill" ? "9999px" : style.value === "square" ? "4px" : "8px" 
                          }}
                          data-testid={`button-style-${style.value}`}
                        >
                          {style.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Colors */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Theme Colors
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Primary Color</Label>
                    <div className="flex gap-2">
                      {["#7c3aed", "#2563eb", "#059669", "#dc2626", "#ea580c", "#0891b2"].map((color) => (
                        <button
                          key={color}
                          onClick={() => setPrimaryColor(color)}
                          className={`h-10 w-10 rounded-full border-2 transition-transform hover:scale-110 ${
                            primaryColor === color ? "border-foreground ring-2 ring-offset-2" : "border-transparent"
                          }`}
                          style={{ backgroundColor: color }}
                          data-testid={`button-primary-color-${color.replace("#", "")}`}
                        />
                      ))}
                      <div className="relative">
                        <input
                          type="color"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          data-testid="input-custom-primary-color"
                        />
                        <div className="h-10 w-10 rounded-full border-2 border-dashed border-muted-foreground flex items-center justify-center">
                          <Plus className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Accent Color</Label>
                    <div className="flex gap-2">
                      {["#f59e0b", "#ec4899", "#8b5cf6", "#06b6d4", "#84cc16", "#f97316"].map((color) => (
                        <button
                          key={color}
                          onClick={() => setAccentColor(color)}
                          className={`h-10 w-10 rounded-full border-2 transition-transform hover:scale-110 ${
                            accentColor === color ? "border-foreground ring-2 ring-offset-2" : "border-transparent"
                          }`}
                          style={{ backgroundColor: color }}
                          data-testid={`button-accent-color-${color.replace("#", "")}`}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Background Pattern */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">Background Style</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { value: "none", label: "Solid" },
                      { value: "dots", label: "Dots" },
                      { value: "waves", label: "Waves" },
                      { value: "geometric", label: "Geometric" }
                    ].map((pattern) => (
                      <button
                        key={pattern.value}
                        onClick={() => setBackgroundPattern(pattern.value)}
                        className={`p-4 border-2 rounded-lg text-center transition-colors ${
                          backgroundPattern === pattern.value 
                            ? "border-primary bg-primary/5" 
                            : "border-border hover:border-primary/50"
                        }`}
                        data-testid={`button-pattern-${pattern.value}`}
                      >
                        <div className="h-8 mb-2 rounded bg-muted flex items-center justify-center">
                          {pattern.value === "dots" && <span className="text-xs">...</span>}
                          {pattern.value === "waves" && <span className="text-xs">~</span>}
                          {pattern.value === "geometric" && <span className="text-xs">/\</span>}
                        </div>
                        <span className="text-sm">{pattern.label}</span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Donor Options */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Donor Options
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <RefreshCw className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Allow Recurring Donations</p>
                        <p className="text-sm text-muted-foreground">Donors can set up monthly giving</p>
                      </div>
                    </div>
                    <Switch
                      checked={enableRecurring}
                      onCheckedChange={setEnableRecurring}
                      data-testid="switch-enable-recurring"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <UserX className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Allow Anonymous Donations</p>
                        <p className="text-sm text-muted-foreground">Donors can give without sharing their name</p>
                      </div>
                    </div>
                    <Switch
                      checked={enableAnonymous}
                      onCheckedChange={setEnableAnonymous}
                      data-testid="switch-enable-anonymous"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Plus className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Round Up for Good</p>
                        <p className="text-sm text-muted-foreground">Let donors round up their gift to the nearest dollar</p>
                      </div>
                    </div>
                    <Switch
                      checked={enableRoundUp}
                      onCheckedChange={setEnableRoundUp}
                      data-testid="switch-enable-roundup"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Goal Meter */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Fundraising Goal
                  </CardTitle>
                  <CardDescription>
                    Show donors how close you are to reaching your goal.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Show Goal Progress</p>
                    <Switch
                      checked={showGoalMeter}
                      onCheckedChange={setShowGoalMeter}
                      data-testid="switch-show-goal"
                    />
                  </div>
                  {showGoalMeter && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Goal Amount</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            className="pl-8"
                            value={goalAmount}
                            onChange={(e) => setGoalAmount(e.target.value)}
                            placeholder="10000"
                            data-testid="input-goal-amount"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Preview</span>
                          <span className="text-muted-foreground">$0 of ${goalAmount || "0"} raised</span>
                        </div>
                        <Progress value={0} className="h-3" />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Share Your Page</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white p-4 rounded-lg mx-auto w-fit">
                <QRCodeSVG value={givingPageUrl} size={120} />
              </div>
              <div className="space-y-2">
                <Label>Page URL</Label>
                <div className="flex gap-2">
                  <Input value={givingPageUrl} readOnly data-testid="input-page-url" />
                  <Button variant="outline" size="icon" data-testid="button-copy-url" onClick={handleCopyUrl}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Live Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <div 
                  className="p-4 text-center text-white relative"
                  style={{ 
                    backgroundColor: primaryColor,
                    backgroundImage: backgroundPattern === "dots" 
                      ? `radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)`
                      : backgroundPattern === "waves"
                      ? `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='rgba(255,255,255,0.1)' d='M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E")`
                      : backgroundPattern === "geometric"
                      ? `linear-gradient(30deg, rgba(255,255,255,0.05) 12%, transparent 12.5%, transparent 87%, rgba(255,255,255,0.05) 87.5%, rgba(255,255,255,0.05)),
                         linear-gradient(150deg, rgba(255,255,255,0.05) 12%, transparent 12.5%, transparent 87%, rgba(255,255,255,0.05) 87.5%, rgba(255,255,255,0.05))`
                      : "none",
                    backgroundSize: backgroundPattern === "dots" ? "12px 12px" : "cover"
                  }}
                >
                  <Cross className="h-8 w-8 mx-auto mb-2" />
                  <p className="font-heading font-bold">{orgName || "Your Organization"}</p>
                </div>
                <div className="p-4 text-center text-sm">
                  {showGoalMeter && goalAmount && (
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>$0 raised</span>
                        <span>Goal: ${goalAmount}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full" 
                          style={{ width: "35%", backgroundColor: accentColor }}
                        />
                      </div>
                    </div>
                  )}
                  <p className="text-muted-foreground line-clamp-2 text-xs mb-3">{aboutText}</p>
                  <div className="flex flex-wrap justify-center gap-1.5 mb-3">
                    {suggestedAmounts.slice(0, 4).map((amt) => (
                      <Button 
                        key={amt} 
                        variant="outline" 
                        size="sm"
                        className="text-xs px-2 py-1 h-7"
                        style={{ 
                          borderRadius: buttonStyle === "pill" ? "9999px" : buttonStyle === "square" ? "4px" : "6px" 
                        }}
                      >
                        ${amt}
                      </Button>
                    ))}
                  </div>
                  <Button 
                    className="w-full text-sm" 
                    size="sm"
                    style={{ 
                      backgroundColor: primaryColor,
                      borderRadius: buttonStyle === "pill" ? "9999px" : buttonStyle === "square" ? "4px" : "6px" 
                    }}
                  >
                    {buttonText || "Give Now"}
                  </Button>
                  {enableRecurring && (
                    <p className="text-xs text-muted-foreground mt-2 flex items-center justify-center gap-1">
                      <RefreshCw className="h-3 w-3" /> Monthly giving available
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Powered by Tither Pay
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
