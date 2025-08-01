
"use client";

import { UserActionsMenu } from '@/components/admin/user-actions-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { type Profile } from '@/lib/types';

// Define a more specific type for the data this table expects
export interface UserForTable extends Profile {
  company_name?: string | null;
  folierer?: any; // Add other role-specific data if needed for display
  hersteller?: any;
  haendler?: any;
}

interface UsersTableProps {
  users: UserForTable[];
}

export function UsersTable({ users }: UsersTableProps) {
  const getRoleVariant = (role: string | null) => {
    switch (role) {
      case 'superadmin': return 'destructive';
      case 'hersteller': return 'secondary';
      case 'folierer': return 'default';
      case 'haendler': return 'outline';
      default: return 'default';
    }
  };

  return (
    <div className="border shadow-sm rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Firma / Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rolle</TableHead>
            <TableHead>Erstellt am</TableHead>
            <TableHead className="text-right">Aktionen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users && users.length > 0 ? (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.company_name || user.full_name || 'N/A'}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={getRoleVariant(user.role)}>{user.role || 'N/A'}</Badge>
                </TableCell>
                <TableCell>
                  {new Date(user.created_at).toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' })}
                </TableCell>
                <TableCell className="text-right">
                  <UserActionsMenu profile={user} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                Keine Benutzer gefunden.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
