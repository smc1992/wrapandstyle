import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts } from '@/lib/wordpress';
import { Post } from '@/lib/wordpress';

const FeaturedArticleCard = ({ post }: { post: Post }) => (
  <div className="lg:col-span-2 bg-white dark:bg-background rounded-xl overflow-hidden shadow-md article-card group">
    <Link href={`/magazin/${post.slug}`}>
      <div className="relative h-80 overflow-hidden">
        {post._embedded?.['wp:featuredmedia']?.[0] && (
          <Image 
            src={post._embedded['wp:featuredmedia'][0].source_url}
            alt={post.title.rendered}
            fill
            className="w-full h-full object-cover article-image group-hover:scale-105 transition-transform duration-500 ease-in-out"
          />
        )}
      </div>
      <div className="p-6">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
          <span>{new Date(post.date).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
        </div>
        <h3 className="text-2xl font-bold mb-3 group-hover:text-primary dark:text-white transition-colors">
          {post.title.rendered}
        </h3>
        {post.excerpt && <div className="text-gray-600 dark:text-gray-300 mb-4" dangerouslySetInnerHTML={{ __html: post.excerpt }} />}
        <div className="flex items-center justify-between mt-4">
          <span className="text-primary font-medium flex items-center gap-1">
            Weiterlesen
            <i className="ri-arrow-right-line"></i>
          </span>
        </div>
      </div>
    </Link>
  </div>
);

const SecondaryArticleCard = ({ post }: { post: Post }) => (
  <div className="bg-white dark:bg-background rounded-xl overflow-hidden shadow-md article-card group">
    <Link href={`/magazin/${post.slug}`}>
      <div className="relative h-48 overflow-hidden">
        {post._embedded?.['wp:featuredmedia']?.[0] && (
          <Image 
            src={post._embedded['wp:featuredmedia'][0].source_url}
            alt={post.title.rendered}
            fill
            className="w-full h-full object-cover article-image group-hover:scale-105 transition-transform duration-500 ease-in-out"
          />
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
           <span>{new Date(post.date).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
        </div>
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary dark:text-white transition-colors">
          {post.title.rendered}
        </h3>
         <span className="text-primary font-medium flex items-center gap-1 mt-3">
            Weiterlesen
            <i className="ri-arrow-right-line"></i>
          </span>
      </div>
    </Link>
  </div>
);

export async function FeaturedArticles() {
  const { data: allPosts, error } = await getAllPosts();

  // If there's an error, or no posts are returned, don't render the component.
  if (error || !allPosts || allPosts.length === 0) {
    if (error) {
      console.error("Error fetching featured articles:", error);
    }
    return null;
  }

  const featuredPost = allPosts[0];
  const secondaryPosts = allPosts.slice(1, 3);

  return (
    <section className="py-12 bg-gray-50 dark:bg-background">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <h2 className="text-2xl font-bold mb-8 dark:text-white">Neueste Artikel</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <FeaturedArticleCard post={featuredPost} />
          <div className="space-y-8">
            {secondaryPosts.map((post) => (
              <SecondaryArticleCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
