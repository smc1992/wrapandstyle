import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Award } from 'lucide-react';

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issue_date: string | null;
  image_url: string | null;
}

export default async function CertificatesPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return notFound();
  }

  const { data: certificates, error } = await supabase
    .from('certificates')
    .select('*')
    .eq('user_id', user.id)
    .order('issue_date', { ascending: false });

  if (error) {
    console.error('Error fetching certificates:', error.message);
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Zertifikate & Auszeichnungen</h1>
          <p className="text-muted-foreground">Präsentieren Sie Ihre Qualifikationen und schaffen Sie Vertrauen.</p>
        </div>
        <Link href="/dashboard/folierer/zertifikate/neu">
            <Button>Zertifikat hinzufügen</Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {certificates && certificates.length > 0 ? (
          certificates.map((cert: Certificate) => (
            <Card key={cert.id} className="overflow-hidden">
              <CardHeader className="flex flex-row items-start bg-muted/50 gap-4 p-4">
                {cert.image_url ? (
                    <Image src={cert.image_url} alt={cert.title} width={80} height={80} className="rounded-md object-cover" />
                ) : (
                    <div className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center">
                        <Award className="h-10 w-10 text-gray-400" />
                    </div>
                )}
                <div className="flex-1">
                    <CardTitle className="text-lg">{cert.title}</CardTitle>
                    <CardDescription>{cert.issuer}</CardDescription>
                    {cert.issue_date && <p className="text-xs text-muted-foreground mt-1">{new Date(cert.issue_date).toLocaleDateString('de-DE')}</p>}
                </div>
              </CardHeader>
              <CardContent className="p-4 flex justify-end gap-2">
                 {/* TODO: Add Edit and Delete functionality */}
                 <Button variant="outline" size="sm" disabled>Bearbeiten</Button>
                 <Button variant="destructive" size="sm" disabled>Löschen</Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12 px-6 bg-gray-50 rounded-lg border-2 border-dashed">
            <h3 className="text-xl font-semibold">Noch keine Zertifikate</h3>
            <p className="text-muted-foreground mt-2">Fügen Sie Ihre erste Auszeichnung hinzu, um Ihre Expertise zu zeigen.</p>
          </div>
        )}
      </div>
    </div>
  );
}
