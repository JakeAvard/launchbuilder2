import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Heart, Users, ArrowUp, Coins } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import tithIconPath from "@assets/Tither_Icon_Green_1766076606860.png";
import type { Organization, Fund, Donation } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

const presetAmounts = ["$25", "$50", "$100", "$250"];

export function PublicGivingPage() {
  const [, params] = useRoute("/give/:slug");
  const slug = params?.slug || "";
  const { toast } = useToast();
  
  const [selectedAmount, setSelectedAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [selectedFund, setSelectedFund] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [roundUp, setRoundUp] = useState(false);

  const { data: organization, isLoading: orgLoading } = useQuery<Organization>({
    queryKey: ["/api/organization/slug", slug],
    enabled: !!slug,
  });

  const { data: funds } = useQuery<Fund[]>({
    queryKey: ["/api/organization", organization?.id, "funds"],
    enabled: !!organization?.id,
  });

  const { data: recentDonations } = useQuery<Donation[]>({
    queryKey: ["/api/organization", organization?.id, "donations"],
    enabled: !!organization?.id,
  });

  const { data: stats } = useQuery<{
    monthTotal: string;
    giftCountMonth: number;
    newDonorsThisMonth: number;
  }>({
    queryKey: ["/api/organization", organization?.id, "stats"],
    enabled: !!organization?.id,
  });

  const donateMutation = useMutation({
    mutationFn: async (data: { amount: string; fundId: string; donorName: string; donorEmail: string; isAnonymous: boolean }) => {
      const fundName = enabledFunds.find(f => f.id === data.fundId)?.name || "General";
      
      let donorId = null;
      if (!data.isAnonymous && data.donorName && data.donorEmail) {
        const donorRes = await apiRequest("POST", `/api/organization/${organization?.id}/donors`, {
          name: data.donorName,
          email: data.donorEmail,
          isAnonymous: false
        });
        const donor = await donorRes.json();
        donorId = donor.id;
      }
      
      const response = await apiRequest("POST", `/api/organization/${organization?.id}/donations`, {
        amount: data.amount,
        fundId: data.fundId,
        fundName,
        donorId,
        donorName: data.isAnonymous ? "Anonymous" : data.donorName,
        isAnonymous: data.isAnonymous
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/organization", organization?.id, "donations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/organization", organization?.id, "stats"] });
      toast({ title: "Thank you for your generous gift!" });
      setSelectedAmount("");
      setCustomAmount("");
      setDonorName("");
      setDonorEmail("");
    }
  });

  const handleAmountSelect = (amount: string) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmount = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount("");
  };

  const getCurrentAmount = () => {
    const base = selectedAmount ? parseFloat(selectedAmount.replace("$", "")) : parseFloat(customAmount) || 0;
    return base;
  };

  const getRoundUpAmount = () => {
    const base = getCurrentAmount();
    if (base <= 0) return 0;
    // Round up to next $5 increment
    const roundedUp = Math.ceil(base / 5) * 5;
    return roundedUp > base ? roundedUp - base : 5;
  };

  const getTotalAmount = () => {
    const base = getCurrentAmount();
    if (roundUp && organization?.enableRoundUp) {
      return base + getRoundUpAmount();
    }
    return base;
  };

  const handleGive = () => {
    const amount = getTotalAmount();
    if (!amount || !selectedFund) {
      toast({ title: "Please select an amount and fund", variant: "destructive" });
      return;
    }
    
    donateMutation.mutate({
      amount: amount.toString(),
      fundId: selectedFund,
      donorName,
      donorEmail,
      isAnonymous
    });
  };

  const enabledFunds = (funds || []).filter(f => f.enabled);
  const recentGifts = (recentDonations || []).slice(0, 3);

  if (orgLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
          <p className="text-muted-foreground">This giving page doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 mx-auto mb-4">
            <img 
              src={tithIconPath} 
              alt="Tither" 
              className="h-8 w-8"
            />
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2" data-testid="text-org-name">
            {organization.name}
          </h1>
          <p className="text-primary-foreground/80 max-w-xl mx-auto">
            Support our community with a secure online gift.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-8">
                <h2 className="font-heading text-xl font-semibold mb-6">Make a Gift</h2>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Select Fund</Label>
                    <Select value={selectedFund} onValueChange={setSelectedFund}>
                      <SelectTrigger data-testid="select-fund">
                        <SelectValue placeholder="Choose a fund" />
                      </SelectTrigger>
                      <SelectContent>
                        {enabledFunds.map((fund) => (
                          <SelectItem key={fund.id} value={fund.id}>
                            {fund.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Gift Amount</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {presetAmounts.map((amount) => (
                        <Button
                          key={amount}
                          variant={selectedAmount === amount ? "default" : "outline"}
                          onClick={() => handleAmountSelect(amount)}
                          className="h-12"
                          data-testid={`button-amount-${amount.replace("$", "")}`}
                        >
                          {amount}
                        </Button>
                      ))}
                    </div>
                    <div className="relative mt-2">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input
                        type="number"
                        placeholder="Other amount"
                        value={customAmount}
                        onChange={(e) => handleCustomAmount(e.target.value)}
                        className="pl-7"
                        data-testid="input-custom-amount"
                      />
                    </div>
                  </div>

                  {organization?.enableRoundUp && getCurrentAmount() > 0 && (
                    <div 
                      className={`p-4 rounded-lg border-2 transition-all ${
                        roundUp 
                          ? "bg-primary/5 border-primary" 
                          : "bg-muted/50 border-transparent"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${roundUp ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                            <Coins className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium flex items-center gap-1">
                              Round Up for Good
                              <ArrowUp className="h-4 w-4 text-primary" />
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Add ${getRoundUpAmount().toFixed(2)} to make your gift ${getTotalAmount().toFixed(0)}
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={roundUp}
                          onCheckedChange={setRoundUp}
                          data-testid="switch-round-up"
                        />
                      </div>
                      {roundUp && (
                        <div className="mt-3 pt-3 border-t flex justify-between text-sm">
                          <span className="text-muted-foreground">Your gift total:</span>
                          <span className="font-bold text-lg">${getTotalAmount().toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Your Name</Label>
                      <Input
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                        placeholder="John Doe"
                        disabled={isAnonymous}
                        data-testid="input-donor-name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={donorEmail}
                        onChange={(e) => setDonorEmail(e.target.value)}
                        placeholder="john@example.com"
                        disabled={isAnonymous}
                        data-testid="input-donor-email"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        id="anonymous" 
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                        className="rounded" 
                        data-testid="checkbox-anonymous" 
                      />
                      <label htmlFor="anonymous" className="text-sm">
                        Give anonymously
                      </label>
                    </div>
                  </div>

                  <Button 
                    className="w-full h-12 text-lg" 
                    data-testid="button-give-now"
                    onClick={handleGive}
                    disabled={donateMutation.isPending}
                  >
                    <Heart className="h-5 w-5 mr-2" />
                    {donateMutation.isPending ? "Processing..." : "Give Now"}
                  </Button>

                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    <span>Secure payment powered by Tither Pay</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-heading font-semibold mb-4">About Us</h3>
                <p className="text-sm text-muted-foreground" data-testid="text-about">
                  {organization.aboutText || `Welcome to ${organization.name}. Your generous gifts support our programs and facilities.`}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-heading font-semibold mb-4 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Recent Gifts
                </h3>
                <div className="space-y-3">
                  {recentGifts.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Be the first to give!</p>
                  ) : (
                    recentGifts.map((donation, i) => (
                      <div key={i} className="flex items-center justify-between text-sm" data-testid={`row-recent-gift-${i}`}>
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4 text-chart-2" />
                          <span>{donation.isAnonymous ? "Anonymous" : donation.donorName} gave ${parseFloat(donation.amount).toFixed(0)}</span>
                        </div>
                        <span className="text-muted-foreground">
                          {donation.createdAt ? formatDistanceToNow(new Date(donation.createdAt), { addSuffix: true }) : "Just now"}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-heading font-semibold mb-4">Your Gift Matters</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="font-heading text-xl font-bold">{stats?.monthTotal || "$0"}</p>
                    <p className="text-xs text-muted-foreground">This month</p>
                  </div>
                  <div>
                    <p className="font-heading text-xl font-bold">{stats?.giftCountMonth || 0}</p>
                    <p className="text-xs text-muted-foreground">Gifts</p>
                  </div>
                  <div>
                    <p className="font-heading text-xl font-bold">{stats?.newDonorsThisMonth || 0}</p>
                    <p className="text-xs text-muted-foreground">Donors</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Deposits typically arrive in 3-5 business days. All gifts are tax-deductible.
          </p>
          <p className="mt-2">
            Powered by <span className="font-medium">Tither Pay</span>
          </p>
        </div>
      </div>
    </div>
  );
}
