import { Link, useLocation } from "wouter";
import { LayoutDashboard, FileText, Users, Settings, HelpCircle, LogOut } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { TitherLogo } from "./Logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Giving Page", href: "/giving-page", icon: FileText },
  { label: "Donors", href: "/donors", icon: Users },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Support", href: "/support", icon: HelpCircle },
];

interface TopNavProps {
  onLogout?: () => void;
}

export function TopNav({ onLogout }: TopNavProps) {
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 h-16 border-b bg-background">
      <div className="flex h-full items-center justify-between gap-4 px-6 max-w-7xl mx-auto">
        <Link href="/">
          <TitherLogo />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location === item.href || 
              (item.href !== "/" && location.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={`gap-2 ${isActive ? "bg-accent text-accent-foreground" : ""}`}
                  data-testid={`link-nav-${item.label.toLowerCase().replace(" ", "-")}`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full" data-testid="button-user-avatar">
                <Avatar>
                  <AvatarFallback>PA</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem disabled className="text-muted-foreground">
                Organization Admin
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout} data-testid="menu-logout">
                <LogOut className="h-4 w-4 mr-2" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
