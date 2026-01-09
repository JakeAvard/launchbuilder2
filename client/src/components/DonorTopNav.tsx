import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Heart, Settings, LogOut, HelpCircle } from "lucide-react";
import { TitherLogo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

interface DonorTopNavProps {
  onLogout: () => void;
}

export function DonorTopNav({ onLogout }: DonorTopNavProps) {
  const [location] = useLocation();

  const navItems = [
    { path: "/donor", label: "Dashboard", icon: LayoutDashboard },
    { path: "/donor/giving", label: "My Giving", icon: Heart },
    { path: "/donor/settings", label: "Settings", icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <TitherLogo />
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location === item.path || (item.path !== "/donor" && location.startsWith(item.path));
              return (
                <Link key={item.path} href={item.path}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    className="gap-2"
                    data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/donor/support">
            <Button variant="ghost" size="icon" data-testid="button-support">
              <HelpCircle className="h-4 w-4" />
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onLogout}
            data-testid="button-logout"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
