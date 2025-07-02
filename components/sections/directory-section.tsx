import { FilterSidebar } from './directory/filter-sidebar';
import { FoliererGrid } from './directory/folierer-grid';

export function DirectorySection() {
  return (
    <section id="verzeichnis" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Folierer-Verzeichnis</h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Finden Sie zertifizierte Fachbetriebe für Fahrzeugfolierung in ganz Deutschland. Nutzen Sie die Filter, um den passenden Partner für Ihr Projekt zu entdecken.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-1">
            <FilterSidebar />
          </div>
          <div className="lg:col-span-2">
            <FoliererGrid />
          </div>
        </div>
      </div>
    </section>
  );
}
