import Image from "next/image";
import Link from "next/link";
import { Post } from "@/lib/wordpress.d";
import {
  getFeaturedMediaById,
  getAuthorById,
  getCategoryById,
} from "@/lib/wordpress";

export async function MainFeaturedPostCard({ post }: { post: Post }) {
  const [media, author, category] = await Promise.all([
    post.featured_media ? getFeaturedMediaById(post.featured_media) : null,
    post.author ? getAuthorById(post.author) : null,
    post.categories?.[0] ? getCategoryById(post.categories[0]) : null,
  ]);

  const date = new Date(post.date).toLocaleDateString("de-DE", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const words = post.content?.rendered.split(" ").length || 0;
  const readingTime = Math.ceil(words / 200);

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md article-card group h-full flex flex-col">
      <Link href={`/magazin/${post.slug}`} className="relative h-80 overflow-hidden block">
        {media?.source_url ? (
          <Image
            src={media.source_url}
            alt={post.title?.rendered || "Featured article"}
            fill
            className="w-full h-full object-cover article-image transition-transform duration-500 ease-in-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500">Kein Bild verfügbar</p>
          </div>
        )}
        {category && (
          <div className="absolute top-4 left-4">
            <span className="bg-primary text-black px-3 py-1 rounded-full text-sm font-medium">
              {category.name}
            </span>
          </div>
        )}
      </Link>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <span>{date}</span>
          <span className="mx-2">•</span>
          <span>{readingTime} Min Lesezeit</span>
        </div>
        <Link href={`/magazin/${post.slug}`}>
          <h3
            className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors"
            dangerouslySetInnerHTML={{ __html: post.title?.rendered || "Unbenannter Beitrag" }}
          />
        </Link>
        <div
          className="text-gray-600 mb-4 flex-grow prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{
            __html: post.excerpt?.rendered || "",
          }}
        />
        <div className="flex items-center justify-between mt-auto pt-4 border-t">
          <div className="flex items-center gap-3">
            {author?.avatar_urls?.["96"] && (
              <Image
                src={author.avatar_urls["96"]}
                alt={author.name || "Autor"}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
              />
            )}
            <span className="font-medium text-sm">{author?.name || "Unbekannter Autor"}</span>
          </div>
          <Link
            href={`/magazin/${post.slug}`}
            className="text-primary font-medium flex items-center gap-1 text-sm"
          >
            Weiterlesen
            <i className="ri-arrow-right-line"></i>
          </Link>
        </div>
      </div>
    </div>
  );
}
