import { createClient } from '@/lib/supabase/server';
import { unstable_noStore as noStore } from 'next/cache';

export async function getFoliererProfile(userId: string) {
  noStore();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('folierer')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching folierer profile:', error);
    return null;
  }

  return data;
}
