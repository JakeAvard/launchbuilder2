import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Download, Filter, Mail, ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useOrganization } from "@/App";
import { format } from "date-fns";

interface DonorStat {
  id: string;
  name: string;
  email: string | null;
  totalGifts: string;
  giftCount: number;
  lastGift: string | null;
  status: string;
}

export function DonorsList() {
  const [searchQuery, setSearchQuery] = useState("");
  const { organization } = useOrganization();

  const { data: donors, isLoading } = useQuery<DonorStat[]>({
    queryKey: ["/api/organization", organization?.id, "donors"],
    enabled: !!organization?.id,
  });

  const donorList = donors || [];

  const filteredDonors = donorList.filter((donor) =>
    donor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (donor.email && donor.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="outline" className="text-chart-2 border-chart-2">Active</Badge>;
      case "new":
        return <Badge variant="outline" className="text-primary border-primary">New</Badge>;
      case "lapsed":
        return <Badge variant="outline" className="text-muted-foreground">Lapsed</Badge>;
      default:
        return null;
    }
  };

  const getInitials = (name: string) => {
    if (name === "Anonymous") return "?";
    return name.split(" ").map((n) => n[0]).join("").slice(0, 2);
  };

  const formatLastGift = (lastGift: string | null) => {
    if (!lastGift) return "Never";
    try {
      return format(new Date(lastGift), "MMM d, yyyy");
    } catch {
      return "Unknown";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold" data-testid="text-donors-title">Donors</h1>
          <p className="text-muted-foreground">View and manage your donor community.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="gap-2" data-testid="button-export">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" className="gap-2" data-testid="button-send-email">
            <Mail className="h-4 w-4" />
            Send Email
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="font-heading">All Donors</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search donors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                  data-testid="input-search-donors"
                />
              </div>
              <Button variant="outline" size="icon" data-testid="button-filter">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">Loading donors...</div>
          ) : filteredDonors.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {searchQuery ? "No donors match your search." : "No donors yet. Share your giving page to start building your community!"}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Donor</TableHead>
                  <TableHead>Total Gifts</TableHead>
                  <TableHead>Gift Count</TableHead>
                  <TableHead>Last Gift</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDonors.map((donor) => (
                  <TableRow key={donor.id} className="cursor-pointer hover-elevate" data-testid={`row-donor-${donor.id}`}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{getInitials(donor.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{donor.name}</p>
                          <p className="text-sm text-muted-foreground">{donor.email || "-"}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{donor.totalGifts}</TableCell>
                    <TableCell>{donor.giftCount}</TableCell>
                    <TableCell>{formatLastGift(donor.lastGift)}</TableCell>
                    <TableCell>{getStatusBadge(donor.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          <div className="flex items-center justify-between mt-6 pt-6 border-t">
            <p className="text-sm text-muted-foreground">
              Showing {filteredDonors.length} of {donorList.length} donors
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" disabled data-testid="button-prev-page">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" disabled data-testid="button-next-page">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
