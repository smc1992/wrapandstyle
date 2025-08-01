import Link from "next/link";
import { Category } from "@/lib/wordpress.d";

export function Sidebar({ categories }: { categories: Category[] }) {
  const popularCategories = [...categories]
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <aside className="lg:w-1/3 space-y-8">
      <div className="bg-white dark:bg-background rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold mb-4 dark:text-white">Beliebte Themen</h3>
        <div className="space-y-4">
          {popularCategories.map((category) => (
            <Link
              key={category.id}
              href={`/magazin?category=${category.id}`}
              className="flex items-center gap-3 group"
            >
              <div>
                <h4 className="font-medium group-hover:text-primary transition-colors">
                  {category.name}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{category.count} Artikel</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
