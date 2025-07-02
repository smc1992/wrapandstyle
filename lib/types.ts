// This file serves as the single source of truth for TypeScript types related to the database schema.

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
