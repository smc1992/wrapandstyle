"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoutButton from '@/components/layout/logout-button';
import { cn } from '@/lib/utils';
import {
  Settings,
  Briefcase,
  Users,
  LayoutDashboard,
  Camera,
  ShieldCheck,
  MessageSquare,
  User as UserIcon,
  ChevronDown,
  LogOut,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { type User } from '@supabase/supabase-js';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

// Define the structure for a navigation item
interface NavItem {
  href: string;
  label: string;
  icon: React.ReactElement;
  roles: string[];
}

// Define all navigation items
const navItems: NavItem[] = [
  { href: '/dashboard/admin', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" />, roles: ['superadmin'] },
  { href: '/dashboard/team', label: 'Team verwalten', icon: <Users className="h-5 w-5" />, roles: ['superadmin'] },
  { href: '/dashboard/admin/users', label: 'Benutzer verwalten', icon: <Users className="h-5 w-5" />, roles: ['superadmin'] },
  { href: '/dashboard/folierer', label: 'Mein Profil', icon: <UserIcon className="h-5 w-5" />, roles: ['folierer'] },
  { href: '/dashboard/folierer/portfolio', label: 'Portfolio', icon: <Camera className="h-5 w-5" />, roles: ['folierer'] },
  { href: '/dashboard/folierer/services', label: 'Leistungen', icon: <Briefcase className="h-5 w-5" />, roles: ['folierer'] },
  { href: '/dashboard/folierer/testimonials', label: 'Referenzen', icon: <MessageSquare className="h-5 w-5" />, roles: ['folierer'] },
  { href: '/dashboard/folierer/certificates', label: 'Zertifikate', icon: <ShieldCheck className="h-5 w-5" />, roles: ['folierer'] },
  { href: '/dashboard/hersteller', label: 'Mein Profil', icon: <UserIcon className="h-5 w-5" />, roles: ['hersteller'] },
  { href: '/dashboard/hersteller/products', label: 'Produkte', icon: <Briefcase className="h-5 w-5" />, roles: ['hersteller'] },
  { href: '/dashboard/haendler', label: 'Mein Profil', icon: <UserIcon className="h-5 w-5" />, roles: ['haendler'] },
];

// Define the structure for the user state, combining Supabase user and profile data
interface UserProfile extends User {
  role: string;
  avatar_url: string | null;
  company_name: string | null;
  full_name: string | null;
}

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          setIsLoading(false);
          return;
        }

        if (profile) {
          setUserProfile({ ...user, ...profile });
        }
      }
      setIsLoading(false);
    };

    fetchUserProfile();
  }, []);

  if (isLoading) {
    return (
      <aside className="hidden h-screen w-64 flex-shrink-0 animate-pulse flex-col border-r bg-background md:flex">
        <div className="flex h-full max-h-screen flex-col gap-2 p-4">
          <div className="h-8 w-3/4 rounded bg-muted"></div>
          <div className="mt-4 flex-1 space-y-2">
            <div className="h-8 w-full rounded bg-muted"></div>
            <div className="h-8 w-full rounded bg-muted"></div>
            <div className="h-8 w-full rounded bg-muted"></div>
          </div>
          <div className="mt-auto">
            <div className="h-12 w-full rounded bg-muted"></div>
          </div>
        </div>
      </aside>
    );
  }

  if (!userProfile) {
    return null; // Don't render the sidebar if no user is found
  }

  const userRole = userProfile.role;
  const displayName = userProfile.company_name || userProfile.full_name || userProfile.email;

  return (
    <aside className="hidden h-screen w-64 flex-shrink-0 flex-col border-r bg-background md:flex">
      <div className="flex h-full max-h-screen flex-col gap-2">
        {/* Header */}
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="">WNP Magazin</span>
          </Link>
        </div>
        
        {/* Navigation */}
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navItems
              .filter(item => item.roles.includes(userRole))
              .map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                    pathname === item.href && 'bg-muted text-primary'
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
          </nav>
        </div>
        
        {/* Footer with Settings and User Dropdown */}
        <div className="mt-auto p-4 border-t">
            <nav className="grid gap-1">
                <Link
                    href="/dashboard/settings"
                    className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                        pathname === '/dashboard/settings' && 'bg-muted text-primary'
                    )}
                    >
                    <Settings className="h-5 w-5" />
                    Einstellungen
                </Link>
            </nav>
            <div className="mt-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex items-center justify-start gap-3 w-full h-auto p-2">
                             <Avatar className="h-9 w-9">
                                <AvatarImage src={userProfile.avatar_url || undefined} alt="User avatar" />
                                <AvatarFallback>{displayName?.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col items-start truncate">
                                <span className="text-sm font-medium truncate">{displayName}</span>
                                <span className="text-xs text-muted-foreground truncate capitalize">{userRole}</span>
                            </div>
                            <ChevronDown className="ml-auto h-4 w-4 shrink-0" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{displayName}</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                {userProfile.email}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                           <LogoutButton>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Abmelden</span>
                           </LogoutButton>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
      </div>
    </aside>
  );
}
