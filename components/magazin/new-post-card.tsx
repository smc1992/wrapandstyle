import Image from "next/image";
import Link from "next/link";
import { Post } from "@/lib/wordpress";
import { formatDate } from "@/lib/utils";

interface PostCardProps {
  post: Post;
  className?: string;
}

const NewPostCard = ({ post, className }: PostCardProps) => {
  const imageUrl = post.jetpack_featured_media_url || "/images/placeholder.png";
  const authorName = post._embedded?.author?.[0]?.name || "Unbekannter Autor";
  const category = post._embedded?.["wp:term"]?.[0]?.[0]?.name || "Uncategorized";
  const readingTime = Math.ceil((post.content.rendered.length / 200) / 5); // WPM based on average reading speed

  return (
    <article className={`group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-lg ${className}`}>
      <Link href={`/magazin/${post.slug}`} className="block h-full">
        <div className="flex h-full flex-col">
          <div className="relative h-48 sm:h-56">
            <Image
              src={imageUrl}
              alt={post.title.rendered}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>

          <div className="flex flex-1 flex-col justify-between p-4 sm:p-6">
            <div>
              <div className="mb-2">
                <span className="inline-block bg-teal-100 text-teal-800 text-xs font-semibold px-3 py-1 rounded-full uppercase">
                  {category}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-teal-600 transition-colors">
                {post.title.rendered}
              </h3>
              <div
                className="mt-2 text-sm leading-relaxed text-gray-500 line-clamp-3"
                dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
              />
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
              <span className="font-medium">{authorName}</span>
              <span>
                {formatDate(post.date)} &bull; {readingTime} min Lesezeit
              </span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default NewPostCard;
