import { getAllPosts, getAllCategories } from '@/lib/wordpress';
import { MagazineFilter } from './magazine-filter';

export async function MagazinePreviewSection() {
  // Fetch all posts and categories on the server
  const allPosts = await getAllPosts();
  const allCategories = await getAllCategories();

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Unser Magazin
          </h2>
          <p className="text-gray-700">
            Von Profis für Profis und Enthusiasten: Entdecken Sie die neuesten Trends, Techniken und DIY-Anleitungen aus der Welt der Fahrzeugfolierung.
          </p>
        </div>

        

        {/* Pass the fetched data to the client component for interactive filtering */}
        <MagazineFilter posts={allPosts} categories={allCategories} />
        
      </div>
    </section>
  );
}
