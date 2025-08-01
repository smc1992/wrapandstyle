import { createClient } from '@/lib/supabase/server';
import { getRecentPosts, Post } from '@/lib/wordpress';

export async function getRecentWordPressPosts(): Promise<{ posts: Post[]; error: string | null }> {
  try {
    const result = await getRecentPosts(5);
    if (result.error || !result.data) {
      throw new Error(result.error || 'Keine Beiträge gefunden.');
    }
    return { posts: result.data, error: null };
  } catch (error: any) {
    console.error('Error fetching recent posts:', error);
    return { posts: [], error: 'Aktuelle Beiträge konnten nicht geladen werden.' };
  }
}

export async function getUserStats() {
  const supabase = await createClient();

  try {
    const { count: totalUsers, error: totalError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    if (totalError) throw totalError;

    const roles = ['folierer', 'haendler', 'hersteller', 'superadmin'];
    const roleCounts: { [key: string]: number } = {};

    for (const role of roles) {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', role);
      
      if (error) throw error;
      roleCounts[role] = count || 0;
    }

    return {
      totalUsers: totalUsers || 0,
      ...roleCounts,
      error: null,
    };
  } catch (error: any) {
    console.error('Error fetching user stats:', error);
    return {
      totalUsers: 0,
      folierer: 0,
      haendler: 0,
      hersteller: 0,
      superadmin: 0,
      error: 'Benutzerstatistiken konnten nicht geladen werden.',
    };
  }
}
