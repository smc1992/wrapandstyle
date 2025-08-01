import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, ExternalLink } from 'lucide-react';

interface QuickAccessProps {
  wpAdminUrl: string;
}

export function QuickAccess({ wpAdminUrl }: QuickAccessProps) {

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schnellzugriff</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
        <Button asChild className="w-full">
          <Link href={wpAdminUrl ? `${wpAdminUrl}/wp-admin/post-new.php` : '#'} target="_blank" rel="noopener noreferrer">
            <PlusCircle className="mr-2 h-4 w-4" />
            Neuer Beitrag
          </Link>
        </Button>
        <Button asChild variant="outline" className="w-full">
          <Link href={wpAdminUrl ? `${wpAdminUrl}/wp-admin` : '#'} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            WordPress Admin
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
