import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Define the shape of a testimonial
interface Testimonial {
  id: string;
  author_name: string;
  author_company: string | null;
  testimonial_text: string;
}

// This page will be the main hub for managing testimonials
export default async function TestimonialsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return notFound();
  }

  const { data: testimonials, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching testimonials:', error.message);
    // Handle error display appropriately in a real app
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Testimonials verwalten</h1>
          <p className="text-muted-foreground">Hier können Sie Kundenstimmen hinzufügen, bearbeiten oder löschen.</p>
        </div>
        <Link href="/dashboard/folierer/testimonials/neu">
            <Button>Testimonial hinzufügen</Button>
        </Link>
      </div>

      <div className="grid gap-6">
        {testimonials && testimonials.length > 0 ? (
          testimonials.map((testimonial: Testimonial) => (
            <Card key={testimonial.id}>
              <CardHeader>
                <CardTitle>{testimonial.author_name}</CardTitle>
                {testimonial.author_company && (
                  <CardDescription>{testimonial.author_company}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="italic text-gray-700">&quot;{testimonial.testimonial_text}&quot;</p>
                <div className="flex gap-2 justify-end">
                  {/* TODO: Add Edit and Delete functionality */}
                  <Button variant="outline" size="sm" disabled>Bearbeiten</Button>
                  <Button variant="destructive" size="sm" disabled>Löschen</Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 px-6 bg-gray-50 rounded-lg border-2 border-dashed">
            <h3 className="text-xl font-semibold">Noch keine Testimonials</h3>
            <p className="text-muted-foreground mt-2">Fügen Sie Ihre erste Kundenstimme hinzu, um Vertrauen bei neuen Kunden aufzubauen.</p>
          </div>
        )}
      </div>
    </div>
  );
}
