'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { upsertTeamMember, type State } from '@/app/lib/actions';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { useToast } from '@/lib/hooks/use-toast';

type TeamMember = any; // Using 'any' as a workaround for the CLI issue

interface TeamMemberFormProps {
  closeSheet: () => void;
  member?: TeamMember | null;
}

export function TeamMemberForm({ closeSheet, member }: TeamMemberFormProps) {
  const initialState: State = { message: null, errors: {} };
  const [state, dispatch] = useActionState(upsertTeamMember, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message?.includes('Successfully')) {
      toast({
        title: 'Success',
        description: state.message,
      });
      closeSheet();
    } else if (state.message) {
      toast({
        title: 'Error',
        description: state.message,
        variant: 'destructive',
      });
    }
  }, [state, toast, closeSheet]);

  return (
        <form action={dispatch} className="space-y-6">
      {member && <input type="hidden" name="id" value={member.id} />}
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" placeholder="Enter team member's name" defaultValue={member?.name} />
        {state.errors?.name &&
          state.errors.name.map((error: string) => (
            <p className="text-sm font-medium text-destructive" key={error}>
              {error}
            </p>
          ))}
      </div>
      <div className="space-y-2">
        <Label htmlFor="role">Position</Label>
                        <Input id="role" name="role" placeholder="Enter position" defaultValue={member?.role} />
        {state.errors?.role &&
          state.errors.role.map((error: string) => (
            <p className="text-sm font-medium text-destructive" key={error}>
              {error}
            </p>
          ))}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="Enter email address" defaultValue={member?.email} />
        {state.errors?.email &&
          state.errors.email.map((error: string) => (
            <p className="text-sm font-medium text-destructive" key={error}>
              {error}
            </p>
          ))}
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" type="tel" placeholder="Enter phone number" defaultValue={member?.phone} />
        {state.errors?.phone &&
          state.errors.phone.map((error: string) => (
            <p className="text-sm font-medium text-destructive" key={error}>
              {error}
            </p>
          ))}
      </div>
      <div className="space-y-2">
        <Label htmlFor="image">Profile Picture</Label>
        <Input id="image" name="image" type="file" accept="image/*" />
        {state.errors?.image &&
          state.errors.image.map((error: string) => (
            <p className="text-sm font-medium text-destructive" key={error}>
              {error}
            </p>
          ))}
      </div>
            <SubmitButton member={member} />
    </form>
  );
}

function SubmitButton({ member }: { member?: TeamMember | null }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" aria-disabled={pending} className="w-full">
      {pending ? (member ? 'Updating...' : 'Creating...') : (member ? 'Update Member' : 'Create Member')}
    </Button>
  );
}
