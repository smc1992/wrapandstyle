'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { TeamMemberForm } from './team-member-form';

export function AddTeamMember() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>Neues Mitglied hinzufügen</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Neues Teammitglied erstellen</SheetTitle>
        </SheetHeader>
        <div className="mt-4">
          <TeamMemberForm closeSheet={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
