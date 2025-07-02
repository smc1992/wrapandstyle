import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import CertificateForm from '@/components/dashboard/certificate-form';

export default function NewCertificatePage() {
  return (
    <div className="p-4 md:p-8">
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Neues Zertifikat hinzufügen</CardTitle>
                <CardDescription>Laden Sie eine neue Auszeichnung oder ein neues Zertifikat hoch.</CardDescription>
            </CardHeader>
            <CardContent>
                <CertificateForm />
            </CardContent>
        </Card>
    </div>
  );
}
