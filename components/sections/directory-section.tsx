import { FilterSidebar } from './directory/filter-sidebar';
import { FoliererGrid } from './directory/folierer-grid';
import { getFoliererProfiles } from '@/app/(main)/folierer/actions';

// Define props to accept searchParams, which will be passed from the page
export async function DirectorySection() {
  // Pass searchParams to the data fetching function to enable filtering
  const foliererProfiles = await getFoliererProfiles();

  return (
    <section id="verzeichnis" className="py-20 bg-gray-50 dark:bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 dark:text-white">Folierer-Verzeichnis</h2>
          <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Finden Sie zertifizierte Fachbetriebe für Fahrzeugfolierung in ganz Deutschland. Nutzen Sie die Filter, um den passenden Partner für Ihr Projekt zu entdecken.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-1">
            {/* 
              Pass searchParams to the sidebar. 
              The sidebar will use these to initialize its state (e.g., location input).
              For Folierer, we don't pass brands or categories, the sidebar should handle this gracefully.
            */}
            <FilterSidebar />
          </div>
          <div className="lg:col-span-2">
            <FoliererGrid profiles={foliererProfiles} />
          </div>
        </div>
      </div>
    </section>
  );
}
