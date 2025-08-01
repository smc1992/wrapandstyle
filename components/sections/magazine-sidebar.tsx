import Link from 'next/link';
import { getAllCategories, getAllTags } from '@/lib/wordpress';
import type { Category, Tag } from '@/lib/wordpress';

const PopularTopics = async () => {
  const { data: categories, error } = await getAllCategories();

  if (error) {
    console.error("Error fetching categories for sidebar:", error);
    return null; // Don't render on error
  }

  return (
    <div className="bg-white dark:bg-background rounded-xl shadow-md p-6 dark:border dark:border-gray-700">
      <h3 className="text-xl font-bold mb-4 dark:text-white">Beliebte Themen</h3>
      <div className="space-y-4">
        {categories && categories.map((category: Category) => (
          <Link href={`/magazin?category=${category.id}`} key={category.id} className="flex items-center gap-3 group">
            {/* Placeholder for image */}
            <div className="w-16 h-16 rounded-lg bg-gray-200 dark:bg-gray-700 flex-shrink-0"></div>
            <div>
              <h4 className="font-medium group-hover:text-primary dark:text-white transition-colors" dangerouslySetInnerHTML={{ __html: category.name }} />
              <p className="text-sm text-gray-500 dark:text-gray-400">{category.count} Artikel</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

const TagsCloud = async () => {
  const { data: tags, error } = await getAllTags();

  if (error) {
    console.error("Error fetching tags for sidebar:", error);
    return null; // Don't render on error
  }

  return (
    <div className="bg-white dark:bg-background rounded-xl shadow-md p-6">
      <h3 className="text-xl font-bold mb-4 dark:text-white">Tags</h3>
      <div className="flex flex-wrap gap-2">
        {tags && tags.map((tag: Tag) => (
          <Link href={`/magazin?tag=${tag.id}`} key={tag.id} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 text-sm rounded-full hover:bg-primary hover:text-black transition-colors">
            {tag.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

const NewsletterSignup = () => (
    <div className="bg-white dark:bg-background rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold mb-4 dark:text-white">Newsletter</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">Bleiben Sie auf dem Laufenden mit den neuesten Nachrichten und Artikeln.</p>
        <form className="flex flex-col gap-3">
            <input type="email" placeholder="Ihre E-Mail-Adresse" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
            <button type="submit" className="w-full bg-primary text-black font-bold py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors">Anmelden</button>
        </form>
    </div>
);

export const MagazineSidebar = () => {
  return (
    <aside className="lg:w-1/3 space-y-8">
      <PopularTopics />
      <TagsCloud />
      <NewsletterSignup />
    </aside>
  );
};
