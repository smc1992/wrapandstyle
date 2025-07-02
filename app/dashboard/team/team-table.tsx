'use client';

import Image from 'next/image';
import { useState } from 'react';
import { MoreHorizontal, PlusCircle } from 'lucide-react';

import { TeamMemberForm } from '@/components/dashboard/team-member-form';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { useToast } from '@/lib/hooks/use-toast';
import { deleteTeamMember } from '@/app/lib/actions';

// Workaround: Use 'any' type while Supabase CLI issue is resolved
type TeamMember = any;

interface TeamTableProps {
  teamMembers: TeamMember[];
}

export function TeamTable({ teamMembers }: TeamTableProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const { toast } = useToast();

  // Placeholder for delete functionality
    const handleDelete = async (id: string) => {
    const confirmation = window.confirm(
      'Are you sure you want to delete this team member? This action cannot be undone.'
    );
    if (!confirmation) {
      return;
    }

    const result = await deleteTeamMember(id);

    if (result?.message.includes('Successfully')) {
      toast({
        title: 'Success',
        description: result.message,
      });
    } else {
      toast({
        title: 'Error',
        description: result?.message || 'An unknown error occurred.',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-bold">Team Management</h1>
            <Button
              size="sm"
              className="h-8 gap-1"
              onClick={() => {
                setSelectedMember(null); // Ensure we're creating, not editing
                setIsSheetOpen(true);
              }}
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Member
              </span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Name</TableHead>
                                <TableHead>Position</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden md:table-cell">Phone</TableHead>
                <TableHead className="hidden md:table-cell">Created at</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamMembers && teamMembers.length > 0 ? (
                teamMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="hidden sm:table-cell">
                      <Image
                        alt={member.name || 'Team member image'}
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        src={member.image_url || '/placeholder.svg'}
                        width="64"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{member.name}</TableCell>
                                        <TableCell>{member.position}</TableCell>
                                        <TableCell className="hidden md:table-cell">
                      {member.email && <a href={`mailto:${member.email}`} className="text-blue-600 hover:underline">{member.email}</a>}
                    </TableCell>
                                        <TableCell className="hidden md:table-cell">
                      {member.phone && <a href={`tel:${member.phone}`} className="text-blue-600 hover:underline">{member.phone}</a>}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {member.created_at}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedMember(member);
                              setIsSheetOpen(true);
                            }}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(member.id)}>
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center">
                    No team members found. Start by adding one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>{teamMembers.length}</strong> of <strong>{teamMembers.length}</strong> members
          </div>
        </CardFooter>
      </Card>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{selectedMember ? 'Edit Team Member' : 'Add Team Member'}</SheetTitle>
            <SheetDescription>
              {selectedMember ? 'Update the details for this team member.' : 'Fill in the details for the new team member.'}
            </SheetDescription>
          </SheetHeader>
          <TeamMemberForm 
            closeSheet={() => setIsSheetOpen(false)} 
            member={selectedMember} 
          />
        </SheetContent>
      </Sheet>
    </>
  );
}
