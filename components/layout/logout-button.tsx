import { logout } from '@/app/auth/actions';
import { Button, type ButtonProps } from '@/components/ui/button';

interface LogoutButtonProps extends Omit<ButtonProps, 'onClick' | 'type'> {
  children?: React.ReactNode;
}

export default function LogoutButton({ children, ...props }: LogoutButtonProps) {
  return (
    <form action={logout}>
      <Button type="submit" variant="destructive" {...props}>
        {children || 'Abmelden'}
      </Button>
    </form>
  );
}
