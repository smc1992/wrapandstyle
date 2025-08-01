import { getUserStats, getRecentWordPressPosts } from './actions';
import { StatCard } from '@/components/admin/stat-card';
import { RecentPostsList } from '@/components/admin/recent-posts-list';
import { QuickAccess } from '@/components/admin/quick-access';
import { Users, User, Building, ShieldCheck, AlertCircle } from 'lucide-react';

export default async function AdminDashboardPage() {
  const wpAdminUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || '';
  const [statsData, postsData] = await Promise.all([
    getUserStats(),
    getRecentWordPressPosts(),
  ]);

  const { error: statsError, ...stats } = statsData;
  const { posts, error: postsError } = postsData;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
      
      {statsError ? (
        <div className="text-red-500 p-4 border border-red-500/50 rounded-lg">
          <h2 className="font-semibold">Fehler beim Laden der Benutzerstatistiken</h2>
          <p>{statsError}</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <StatCard 
            title="Gesamte Benutzer"
            value={stats.totalUsers || 0}
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
          />
          <StatCard 
            title="Folierer"
            value={stats.folierer || 0}
            icon={<User className="h-4 w-4 text-muted-foreground" />}
          />
          <StatCard 
            title="Händler"
            value={stats.haendler || 0}
            icon={<Building className="h-4 w-4 text-muted-foreground" />}
          />
          <StatCard 
            title="Hersteller"
            value={stats.hersteller || 0}
            icon={<Building className="h-4 w-4 text-muted-foreground" />}
          />
          <StatCard 
            title="Superadmins"
            value={stats.superadmin || 0}
            icon={<ShieldCheck className="h-4 w-4 text-muted-foreground" />}
          />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentPostsList posts={posts} error={postsError} wpAdminUrl={wpAdminUrl} />
        </div>
        <div>
          <QuickAccess wpAdminUrl={wpAdminUrl} />
        </div>
      </div>
    </div>
  );
}
