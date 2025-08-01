'use server';

import { createClient } from '@/lib/supabase/server';
import type { HaendlerProfileCard } from '@/lib/types';

// Re-export Supabase-sourced types for filter sidebar
export type { Brand, ProductCategory } from '@/lib/types';

// This type definition now correctly models the deeply nested array structure
// that the Supabase client returns, as inferred by the TypeScript linter.
type HaendlerFromSupabase = {
  user_id: string;
  firma: string;
  slug: string;
  address: string | null;
  logo_url: string | null;
  // It's an array of join table objects
  haendler_brands: {
    // each join table object has a `brands` property which is an array of the actual brand objects
    brands: { name: string; slug: string }[]
  }[];
  haendler_product_categories: {
    product_categories: { name: string; slug: string }[]
  }[];
};

// Fetches all available brands from Supabase
export async function getBrands() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('brands').select('id, name, slug').order('name', { ascending: true });
  if (error) {
    console.error('Error fetching brands from Supabase:', error);
    return [];
  }
  return data || [];
}

// Fetches all available product categories from Supabase
export async function getProductCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('product_categories').select('id, name, slug').order('name', { ascending: true });
  if (error) {
    console.error('Error fetching product categories from Supabase:', error);
    return [];
  }
  return data || [];
}

// A temporary type to hold the reshaped data before filtering.
interface ProfileWithSlugs extends HaendlerProfileCard {
  brandSlugs: string[];
  categorySlugs: string[];
}

// Fetches and filters Händler profiles from Supabase
export async function getHaendlerProfiles(
  searchParams: { [key: string]: string | string[] | undefined }
): Promise<HaendlerProfileCard[]> {
  const supabase = await createClient();

  // The query now also fetches the 'slug' for brands and categories.
  let query = supabase.from('haendler').select(`
    user_id,
    firma,
    slug,
    address,
    logo_url,
    haendler_brands!inner(brands(name, slug)),
    haendler_product_categories!inner(product_categories(name, slug))
  `);

  const location = searchParams?.location as string;
  if (location) {
    const lowerLocation = location.toLowerCase();
    query = query.or(`firma.ilike.%${lowerLocation}%,address.ilike.%${lowerLocation}%`);
  }

  const { data, error } = await query.returns<HaendlerFromSupabase[]>();

  if (error) {
    console.error('Error fetching Händler profiles from Supabase:', error);
    return [];
  }

  if (!data) {
    return [];
  }

  // 1. Reshape the raw data into a clean, filterable structure first.
  let profiles: ProfileWithSlugs[] = data.map(p => {
    const brandNames = p.haendler_brands
      .flatMap(joinObject => joinObject.brands) // Flattens the nested arrays of brands
      .map(brand => brand.name) // Gets the name from each brand
      .filter(Boolean); // Removes any falsy values

    const brandSlugs = p.haendler_brands
      .flatMap(joinObject => joinObject.brands)
      .map(brand => brand.slug)
      .filter(Boolean);

    const categoryNames = p.haendler_product_categories
      .flatMap(joinObject => joinObject.product_categories)
      .map(category => category.name)
      .filter(Boolean);

    const categorySlugs = p.haendler_product_categories
      .flatMap(joinObject => joinObject.product_categories)
      .map(category => category.slug)
      .filter(Boolean);

    return {
      user_id: p.user_id,
      firma: p.firma,
      slug: p.slug,
      address: p.address,
      logo_url: p.logo_url,
      brands: brandNames,
      brandSlugs: brandSlugs,
      product_categories: categoryNames,
      categorySlugs: categorySlugs,
    };
  });

  // 2. Now, filter this clean list.
  const brandSlugsToFilter = (searchParams?.brands as string)?.split(',').filter(Boolean);
  if (brandSlugsToFilter && brandSlugsToFilter.length > 0) {
    profiles = profiles.filter(p =>
      brandSlugsToFilter.some(slug => p.brandSlugs.includes(slug))
    );
  }

  const categorySlugsToFilter = (searchParams?.categories as string)?.split(',').filter(Boolean);
  if (categorySlugsToFilter && categorySlugsToFilter.length > 0) {
    profiles = profiles.filter(p =>
      categorySlugsToFilter.some(slug => p.categorySlugs.includes(slug))
    );
  }

  // 3. Remove the temporary properties before returning the final result.
  const finalProfiles: HaendlerProfileCard[] = profiles.map(({ brandSlugs, categorySlugs, ...profile }) => profile);

  return finalProfiles.sort((a, b) => a.firma?.localeCompare(b.firma || '') || 0);
}
