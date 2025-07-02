import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import TestimonialForm from '@/components/dashboard/testimonial-form';

export default function NewTestimonialPage() {
  return (
    <div className="p-4 md:p-8">
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Neues Testimonial erstellen</CardTitle>
                <CardDescription>Fügen Sie eine neue Kundenstimme zu Ihrem Profil hinzu.</CardDescription>
            </CardHeader>
            <CardContent>
                <TestimonialForm />
            </CardContent>
        </Card>
    </div>
  );
}
