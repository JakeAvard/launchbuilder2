import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, TrendingUp, Calendar, Download, DollarSign, Target, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

const monthlyData = [
  { month: "Jan", amount: 150, roundUp: 8 },
  { month: "Feb", amount: 100, roundUp: 5 },
  { month: "Mar", amount: 200, roundUp: 12 },
  { month: "Apr", amount: 175, roundUp: 9 },
  { month: "May", amount: 225, roundUp: 15 },
  { month: "Jun", amount: 180, roundUp: 10 },
];

const categoryData = [
  { name: "General Fund", value: 450, color: "hsl(var(--primary))" },
  { name: "Building", value: 200, color: "hsl(var(--chart-2))" },
  { name: "Youth", value: 150, color: "hsl(var(--chart-3))" },
  { name: "Outreach", value: 100, color: "hsl(var(--chart-4))" },
];

const organizationData = [
  { name: "St. Mary's", amount: 600 },
  { name: "Holy Cross", amount: 250 },
  { name: "St. Joseph's", amount: 150 },
];

export function DonorGivingDashboard() {
  const [roundUpEnabled, setRoundUpEnabled] = useState(true);
  const [roundUpAmount, setRoundUpAmount] = useState<"1" | "5" | "10">("5");

  const stats = {
    totalGiven: 1425,
    thisYear: 1030,
    thisMonth: 180,
    roundUpTotal: 59,
    organizationsSupported: 3,
    avgMonthly: 171.67,
    trend: 12.5,
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold" data-testid="text-giving-title">
            My Giving
          </h1>
          <p className="text-muted-foreground">Track your donations and financial impact</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" data-testid="button-download-statement">
            <Download className="h-4 w-4 mr-2" />
            Annual Statement
          </Button>
          <Button variant="default" data-testid="button-make-gift">
            <Heart className="h-4 w-4 mr-2" />
            Make a Gift
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Given</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-given">
              ${stats.totalGiven.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">All-time contributions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Year</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-year-total">
              ${stats.thisYear.toLocaleString()}
            </div>
            <div className="flex items-center text-xs">
              <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500">{stats.trend}%</span>
              <span className="text-muted-foreground ml-1">vs last year</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Round Up Total</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary" data-testid="text-roundup-total">
              ${stats.roundUpTotal}
            </div>
            <p className="text-xs text-muted-foreground">Extra impact from rounding</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Avg</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-monthly-avg">
              ${stats.avgMonthly.toFixed(0)}
            </div>
            <p className="text-xs text-muted-foreground">Average per month</p>
          </CardContent>
        </Card>
      </div>

      <Card className="p-4 bg-primary/5 border-primary/20">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Target className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold">Round Up for Good</h3>
              <p className="text-sm text-muted-foreground">
                {roundUpEnabled 
                  ? `Rounding donations to nearest $${roundUpAmount}` 
                  : "Enable to add a little extra to each gift"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {roundUpEnabled && (
              <div className="flex gap-2">
                {(["1", "5", "10"] as const).map((amt) => (
                  <Button
                    key={amt}
                    size="sm"
                    variant={roundUpAmount === amt ? "default" : "outline"}
                    onClick={() => setRoundUpAmount(amt)}
                    data-testid={`button-roundup-${amt}`}
                  >
                    ${amt}
                  </Button>
                ))}
              </div>
            )}
            <Switch
              checked={roundUpEnabled}
              onCheckedChange={setRoundUpEnabled}
              data-testid="switch-roundup"
            />
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Giving Trend</CardTitle>
            <CardDescription>Your donations over the past 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#colorAmount)"
                    name="Donation"
                  />
                  <Area
                    type="monotone"
                    dataKey="roundUp"
                    stroke="hsl(var(--chart-2))"
                    fill="hsl(var(--chart-2))"
                    fillOpacity={0.3}
                    name="Round Up"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Giving by Category</CardTitle>
            <CardDescription>Where your donations go</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [`$${value}`, "Amount"]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Organizations You Support</CardTitle>
          <CardDescription>Your giving distributed by organization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={organizationData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                <XAxis type="number" className="text-xs" />
                <YAxis dataKey="name" type="category" className="text-xs" width={100} />
                <Tooltip
                  formatter={(value: number) => [`$${value}`, "Total Given"]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Donations</CardTitle>
            <CardDescription>Your last 5 transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { org: "St. Mary's", fund: "General Fund", amount: 100, roundUp: 0, date: "Jan 15" },
                { org: "St. Mary's", fund: "Building Fund", amount: 250, roundUp: 0, date: "Jan 1" },
                { org: "Holy Cross", fund: "Youth Ministry", amount: 47, roundUp: 3, date: "Dec 25" },
                { org: "St. Joseph's", fund: "Outreach", amount: 75, roundUp: 0, date: "Dec 15" },
                { org: "St. Mary's", fund: "General Fund", amount: 100, roundUp: 0, date: "Dec 1" },
              ].map((donation, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Heart className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{donation.org}</p>
                      <p className="text-xs text-muted-foreground">{donation.fund}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">
                      ${donation.amount + donation.roundUp}
                      {donation.roundUp > 0 && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          +${donation.roundUp} RU
                        </Badge>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">{donation.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tax Documents</CardTitle>
            <CardDescription>Download your giving statements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { year: "2024", total: 1030, status: "In Progress" },
              { year: "2023", total: 395, status: "Available" },
            ].map((doc) => (
              <div key={doc.year} className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <p className="font-medium">{doc.year} Annual Statement</p>
                  <p className="text-sm text-muted-foreground">Total: ${doc.total}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={doc.status === "In Progress"}
                  data-testid={`button-download-${doc.year}`}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {doc.status === "In Progress" ? "Pending" : "Download"}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
