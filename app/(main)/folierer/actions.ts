'use server';

import { createPublicClient } from '@/lib/supabase/server';
import type { FoliererProfileCard } from '@/lib/types';

/**
 * Fetches a list of public profiles for 'Folierer' for the directory cards.
 * This function queries the 'folierer' table and joins related data.
 */
export async function getFoliererProfiles(): Promise<FoliererProfileCard[]> {
  try {
    // Verwende createPublicClient für statische Generierung (ohne cookies)
    const supabase = createPublicClient();

    const { data, error } = await supabase
      .from('folierer')
      .select(`
        user_id,
        firma,
        slug,
        adresse,
        logo_url,
        folierer_services (
          title
        )
      `)
      .not('firma', 'is', null); // Ensure we only get valid profiles

    if (error) {
      console.error('Error fetching folierer profiles for cards:', error.message);
      throw new Error(error.message);
    }

    if (!data) {
      return [];
    }

    // Transform the data into the FoliererProfileCard shape.
    const profiles: FoliererProfileCard[] = data
      .map((item: any) => ({
        user_id: item.user_id,
        slug: item.slug || item.user_id, // Fallback to user_id if slug is missing
        firma: item.firma,
        address: item.adresse, // Map 'adresse' from DB to 'address' in the type
        logo_url: item.logo_url,
        services: item.folierer_services?.map((s: any) => s.title) ?? [],
      }))
      .filter((profile: any): profile is FoliererProfileCard => !!profile.firma);

    return profiles;
  } catch (err: any) {
    console.error('Unexpected error in getFoliererProfiles:', err.message);
    // Return empty array to prevent page crash on server error.
    return [];
  }
}
