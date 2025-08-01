"use client";

import Link from 'next/link';
import { MoreHorizontal, Edit, Trash2, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type Profile } from '@/lib/types';
import { ResetPasswordAction } from '@/components/admin/reset-password-action';
import { DeleteUserDialog } from '@/components/admin/delete-user-dialog';

interface UserActionsMenuProps {
  profile: Profile;
}

export function UserActionsMenu({ profile }: UserActionsMenuProps) {
  if (!profile || !profile.id) return null;

  // Sicherheitsprüfung: Verhindert, dass ein Superadmin sich selbst löschen oder
  // sein Passwort zurücksetzen kann, um eine Aussperrung zu vermeiden.
  const isSuperAdmin = profile.role === 'superadmin';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Menü öffnen</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Aktionen</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/admin/users/${profile.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            <span>Bearbeiten</span>
          </Link>
        </DropdownMenuItem>

        <ResetPasswordAction email={profile.email!}>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()} disabled={isSuperAdmin}>
             <KeyRound className="mr-2 h-4 w-4" />
            <span>Passwort zurücksetzen</span>
          </DropdownMenuItem>
        </ResetPasswordAction>

        <DropdownMenuSeparator />

        <DeleteUserDialog userId={profile.id} role={profile.role!}>
          {/* The div below is styled to look like a DropdownMenuItem but is a trigger for the dialog */}
          <div 
            className={`relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground text-destructive focus:text-destructive focus:bg-red-50 ${isSuperAdmin ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            // Prevent dialog from opening if the action is disabled
            onClick={(e) => { if (isSuperAdmin) e.preventDefault(); }}
            aria-disabled={isSuperAdmin}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Benutzer löschen</span>
          </div>
        </DeleteUserDialog>

      </DropdownMenuContent>
    </DropdownMenu>
  );
}
