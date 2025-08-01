import { getAllPosts, getAllCategories } from '@/lib/wordpress';
import { MagazineFilter } from './magazine-filter';

export async function MagazinePreviewSection() {
  // Fetch all posts and categories on the server
  const { data: allPosts, error: postsError } = await getAllPosts();
  const { data: allCategories, error: categoriesError } = await getAllCategories();

  if (postsError || categoriesError) {
    console.error("Error fetching magazine preview data:", { postsError, categoriesError });
    // Don't render the section if data is unavailable.
    return null;
  }

  return (
    <section className="py-20 bg-gray-50 dark:bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4 dark:text-white">
            Unser Magazin
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Von Profis für Profis und Enthusiasten: Entdecken Sie die neuesten Trends, Techniken und DIY-Anleitungen aus der Welt der Fahrzeugfolierung.
          </p>
        </div>

        

        {/* Pass the fetched data to the client component for interactive filtering */}
        <MagazineFilter posts={allPosts || []} categories={allCategories || []} />
        
      </div>
    </section>
  );
}
