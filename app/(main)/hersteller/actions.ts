'use server';

import { createClient } from '@/lib/supabase/server';
import type { HerstellerProfile, HerstellerProfileCard } from '@/lib/types';

/**
 * Fetches a list of public profiles for 'Hersteller' for the directory cards.
 * This function queries the 'hersteller' table.
 */
export async function getHerstellerProfiles(
  searchParams: { [key: string]: string | string[] | undefined }
): Promise<HerstellerProfileCard[]> {
  try {
    const supabase = await createClient();
    const location = searchParams?.location as string | undefined;

    let query = supabase
      .from('hersteller')
      .select(`
        user_id,
        firma,
        slug,
        logo_url,
        address
      `)
      .not('firma', 'is', null);

    if (location) {
      query = query.ilike('address', `%${location}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching hersteller profiles for cards:', error.message);
      throw new Error(error.message);
    }

    if (!data) {
      return [];
    }

    // Transform the data into the HerstellerProfileCard shape.
    const profiles: HerstellerProfileCard[] = data
      .map((item: any) => ({
        user_id: item.user_id,
        slug: item.slug,
        firma: item.firma,
        logo_url: item.logo_url,
        address: item.address,
      }))
      .filter((profile): profile is HerstellerProfileCard => !!profile.firma);

    return profiles;
  } catch (err: any) {
    console.error('Unexpected error in getHerstellerProfiles:', err.message);
    // Return empty array to prevent page crash on server error.
    return [];
  }
}

/**
 * Fetches a single, detailed public profile for a 'Hersteller' by their slug.
 * @param slug The URL-friendly slug of the hersteller.
 * @returns A single HerstellerProfile object or null if not found.
 */
export async function getHerstellerProfileBySlug(slug: string): Promise<HerstellerProfile | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('hersteller')
      .select('*') // Select all columns for the detailed view
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // This code means no rows were found, which is a valid case.
        console.log(`No hersteller profile found for slug: ${slug}`);
        return null;
      }
      // For other errors, log them and re-throw.
      console.error(`Error fetching hersteller profile for slug ${slug}:`, error.message);
      throw new Error(error.message);
    }

    return data as HerstellerProfile;

  } catch (err: any) {
    console.error(`Unexpected error in getHerstellerProfileBySlug for slug ${slug}:`, err.message);
    // Return null to allow the page to handle the 'not found' state.
    return null;
  }
}


