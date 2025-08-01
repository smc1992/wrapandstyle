import { FilterSidebar } from './directory/filter-sidebar';
import { HaendlerGrid } from './directory/haendler-grid';
import { getHaendlerProfiles, getBrands, getProductCategories } from '@/app/(main)/haendler/actions';

interface HaendlerDirectorySectionProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export async function HaendlerDirectorySection({ searchParams }: HaendlerDirectorySectionProps) {
  // Fetch all required data in parallel for efficiency
  const [haendlerProfiles, brands, productCategories] = await Promise.all([
    getHaendlerProfiles(searchParams),
    getBrands(),
    getProductCategories(),
  ]);

  return (
    <section id="verzeichnis" className="py-20 bg-gray-50 dark:bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 dark:text-white">Händler-Verzeichnis</h2>
          <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Finden Sie offizielle Händler und Distributoren für hochwertige Folien und Zubehör. Nutzen Sie die Filter, um den passenden Partner für Ihr Projekt zu entdecken.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-1">
            <FilterSidebar 
              searchParams={searchParams} 
              brands={brands} 
              productCategories={productCategories} 
            />
          </div>
          <div className="lg:col-span-2">
            <HaendlerGrid profiles={haendlerProfiles} />
          </div>
        </div>
      </div>
    </section>
  );
}
