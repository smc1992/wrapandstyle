import Image from "next/image";
import Link from "next/link";
import { Post } from "@/lib/wordpress";
import { formatDate } from "@/lib/utils";

interface FeaturedPostCardProps {
  post: Post;
}

const FeaturedPostCard = ({ post }: FeaturedPostCardProps) => {
  const imageUrl = post.jetpack_featured_media_url || "/images/placeholder.png";
  const authorName = post._embedded?.author?.[0]?.name || "Unbekannter Autor";
  const category = post._embedded?.["wp:term"]?.[0]?.[0]?.name || "Uncategorized";

  return (
    <article className="group relative block overflow-hidden rounded-xl shadow-lg">
      <Link href={`/magazin/${post.slug}`} className="block">
        <div className="relative h-64 sm:h-80 lg:h-96">
          <Image
            src={imageUrl}
            alt={`Titelbild für ${post.title.rendered}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 66vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10"></div>
        </div>

        <div className="absolute bottom-0 left-0 p-6 sm:p-8">
          <div className="mb-2">
            <span className="inline-block bg-teal-500 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
              {category}
            </span>
          </div>
          <h3 className="text-2xl lg:text-3xl font-bold text-white transition-colors group-hover:text-teal-100">
            {post.title.rendered}
          </h3>
          <div className="mt-4 text-sm text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span>Von {authorName}</span>
            <span className="mx-2">&bull;</span>
            <span>{formatDate(post.date)}</span>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default FeaturedPostCard;
