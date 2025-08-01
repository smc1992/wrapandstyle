// This file serves as the single source of truth for TypeScript types related to the database schema.

/**
 * Represents the structure of a user profile, mirroring the 'profiles' table in Supabase.
 */
export interface Profile {
  id: string; // This is the user_id from auth.users
  created_at: string;
  email: string;
  role: 'hersteller' | 'folierer' | 'haendler' | 'superadmin';
  full_name?: string | null;
  avatar_url?: string | null;

  // Address fields are part of the central profile
  street?: string | null;
  house_number?: string | null;
  zip_code?: string | null;
  city?: string | null;
  phone_number?: string | null;
  webseite?: string | null;
}

/**
 * Represents the structure of a manufacturer, mirroring the 'hersteller' table.
 */
export interface Hersteller {
  user_id: string; // Foreign key to profiles.id
  firma: string;
  slug: string;
  phone_number?: string | null;
  webseite?: string | null;
  ansprechpartner?: string | null;
  company_description?: string | null;
  company_history?: string | null;
  mission_statement?: string | null;
  vision_statement?: string | null;
  product_categories?: string[];
  youtube_channel_url?: string | null;
  video_url?: string | null;
  // Add any other hersteller-specific fields here
}


export type Testimonial = {
  id: string;
  customer_name: string;
  text: string;
  rating: number;
  created_at: string;
};

export type DetailedService = {
  id: string;
  title: string;
  description: string;
  icon: string | null;
};

export type Certificate = {
  id: string;
  name: string;
  issuer: string;
  year: number;
  image_url: string | null;
  created_at: string;
};

export type PortfolioImage = {
  id: string;
  user_id: string; // Required by gallery for actions
  image_url: string;
  storage_path: string; // Required by gallery for actions
  title: string | null;
  description: string | null;
  created_at: string;
};

// Represents the full profile of a 'Folierer' as queried from the database,
// including relational data.
export type FoliererProfile = {
  user_id: string;
  created_at: string;
  updated_at: string;
  firma: string | null;
  ansprechpartner: string | null;
  telefon: string | null;
  webseite: string | null;
  logo_url: string | null;
  slug: string | null;
  company_description: string | null;
  address: string | null; // The main address field used for the map
  phone_number: string | null;
  opening_hours: any | null; // JSONB, can be defined more strictly if needed
  youtube_channel_url: string | null;
  video_url: string | null;
  mission_statement: string | null;
  vision_statement: string | null;
  company_history: string | null;
  // Relational fields that are joined in queries
  services?: { service_name: string }[];
  testimonials?: Testimonial[];
  certificates?: Certificate[];
  portfolio_images?: PortfolioImage[];
  // Deprecated fields included for type safety during transition, can be removed later.
  strasse_hausnummer?: string | null;
  plz_ort?: string | null;
  spezialisierungen?: string[] | null;
};

// A slimmed-down version for preview cards in directories or on the homepage.
export type FoliererProfileCard = {
  user_id: string;
  firma: string | null;
  slug: string | null;
  address: string | null;
  logo_url: string | null;
  services: string[] | null; // Assuming 'services' is an array of strings in the DB
};

// ==================================================================
// GENERAL TYPES
// ==================================================================

export type Brand = {
  id: number;
  name: string;
};

export type ProductCategory = {
  id: number;
  name: string;
};

// ==================================================================
// HÄNDLER / DISTRIBUTOR TYPES
// ==================================================================

// Represents the full profile of a 'Haendler' as queried from the database.
export type HaendlerProfile = {
  user_id: string;
  created_at: string | null;
  updated_at: string | null;
  firma: string | null;
  ansprechpartner: string | null;
  webseite: string | null;
  logo_url: string | null;
  slug: string | null;
  company_description: string | null;
  address: string | null;
  phone_number: string | null;
  email: string | null; // Added from joined 'profiles' table
  opening_hours: any | null; // JSONB
  youtube_channel_url: string | null;
  video_url: string | null;
  brands: Brand[]; 
  product_categories: ProductCategory[];
};

// A slimmed-down version for preview cards in the Händler directory.
export type HaendlerProfileCard = {
  user_id: string;
  firma: string | null;
  slug: string | null;
  address: string | null;
  logo_url: string | null;
  brands: string[]; // In the card, we just need the names
  product_categories: string[]; // In the card, we just need the names
};

// ==================================================================
// HERSTELLER TYPES
// ==================================================================

// Represents the full profile of a 'Hersteller' as queried from the database.
export type HerstellerProfile = {
  user_id: string;
  created_at: string;
  updated_at: string;
  firma: string | null;
  ansprechpartner: string | null;
  webseite: string | null;
  logo_url: string | null;
  slug: string | null;
  company_description: string | null;
  address: string | null;
  phone_number: string | null;
  opening_hours: any | null; // JSONB
  youtube_channel_url: string | null;
  video_url: string | null;
  mission_statement: string | null;
  vision_statement: string | null;
  company_history: string | null;
  product_categories: string[] | null; // Array of product categories
};

// A slimmed-down version for preview cards in the Hersteller directory.
export type HerstellerProfileCard = {
  user_id: string;
  firma: string | null;
  slug: string | null;
  address: string | null;
  logo_url: string | null;
};
