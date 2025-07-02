'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoutButton from '@/components/layout/logout-button';
import { cn } from '@/lib/utils';
import {
  Settings,
  Briefcase,
  GalleryHorizontal,
  Users,
  LogOut,
  MessageSquareQuote,
  Award,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { type User } from '@supabase/supabase-js';

// Define all possible user roles
type UserRole = 'folierer' | 'hersteller' | 'haendler' | 'superadmin';

interface SidebarProps {
  user: User;
  userRole: UserRole;
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactElement;
  roles: Array<UserRole>;
}

export function DashboardSidebar({ user, userRole }: SidebarProps) {
  const pathname = usePathname();

  // Define all navigation items for all roles
  const navItems: NavItem[] = [
    // Regular user roles
    {
      href: `/dashboard/${userRole}`,
      icon: <Briefcase className="h-5 w-5" />,
      label: 'Übersicht',
      roles: ['folierer', 'hersteller', 'haendler'],
    },
    {
      href: `/dashboard/folierer/portfolio`,
      icon: <GalleryHorizontal className="h-5 w-5" />,
      label: 'Portfolio',
      roles: ['folierer'],
    },
    {
      href: `/dashboard/folierer/testimonials`,
      icon: <MessageSquareQuote className="h-5 w-5" />,
      label: 'Testimonials',
      roles: ['folierer'],
    },
    {
      href: `/dashboard/folierer/zertifikate`,
      icon: <Award className="h-5 w-5" />,
      label: 'Zertifikate',
      roles: ['folierer'],
    },
    // Superadmin role
    {
      href: '/dashboard/admin',
      icon: <Settings className="h-5 w-5" />,
      label: 'Admin Übersicht',
      roles: ['superadmin'],
    },
    {
      href: '/dashboard/team',
      icon: <Users className="h-5 w-5" />,
      label: 'Team Management',
      roles: ['superadmin'],
    },
  ];

  // Determine the main dashboard link based on role
  const dashboardHomeLink = userRole === 'superadmin' ? '/dashboard/admin' : `/dashboard/${userRole}`;

  return (
    <aside className="hidden md:flex md:flex-col md:h-screen md:w-64 bg-background border-r py-4">
      {/* Logo/Branding */}
      <div className="px-6 mb-6 mt-2">
        <Link href={dashboardHomeLink} className="flex items-center gap-2">
          <Briefcase className="h-8 w-8 text-primary" />
          <span className='text-lg font-semibold'>Dashboard</span>
        </Link>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 flex flex-col space-y-2 px-4">
        {navItems
          .filter(item => item.roles.includes(userRole))
          .map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors',
                pathname === item.href ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
      </nav>

      {/* User Account Dropdown */}
      <div className="mt-auto p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 w-full text-left p-2 rounded-lg hover:bg-accent transition-colors">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user.user_metadata.avatar_url} alt="User avatar" />
                <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col truncate">
                <span className="text-sm font-medium truncate">{user.user_metadata.full_name || user.email}</span>
                <span className="text-xs text-muted-foreground truncate capitalize">{userRole}</span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.user_metadata.full_name || 'User'}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
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
    </aside>
  );
}
