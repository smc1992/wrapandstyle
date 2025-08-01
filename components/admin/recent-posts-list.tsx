import { Post } from '@/lib/wordpress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { format } from 'date-fns';

interface RecentPostsListProps {
  posts: Post[];
  error: string | null;
  wpAdminUrl: string;
}

export function RecentPostsList({ posts, error, wpAdminUrl }: RecentPostsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Letzte Magazinbeiträge</CardTitle>
      </CardHeader>
      <CardContent>
        {error && <p className="text-red-500">{error}</p>}
        {!error && posts.length === 0 && <p className="text-muted-foreground">Keine Beiträge gefunden.</p>}
        <ul className="space-y-4">
          {posts.map(post => (
            <li key={post.id} className="flex items-center justify-between">
              <div>
                <Link href={`/magazin/${post.slug}`} className="font-medium hover:underline" prefetch={false}>
                  {post.title.rendered}
                </Link>
                <p className="text-sm text-muted-foreground">
                  Veröffentlicht am {format(new Date(post.date), 'dd.MM.yyyy')}
                </p>
              </div>
              <Link href={`${wpAdminUrl}/wp-admin/post.php?post=${post.id}&action=edit`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">
                Bearbeiten
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
