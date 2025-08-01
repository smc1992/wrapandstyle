// Common types that are reused across multiple entities
interface WPEntity {
  id: number;
  date: string;
  date_gmt: string;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: "publish" | "future" | "draft" | "pending" | "private";
  link: string;
  guid: {
    rendered: string;
  };
}

interface RenderedContent {
  rendered: string;
  protected: boolean;
}

interface RenderedTitle {
  rendered: string;
}

// Media types
interface MediaSize {
  file: string;
  width: number;
  height: number;
  mime_type: string;
  source_url: string;
}

interface MediaDetails {
  width: number;
  height: number;
  file: string;
  sizes: Record<string, MediaSize>;
}

export interface FeaturedMedia extends WPEntity {
  title: RenderedTitle;
  author: number;
  caption: {
    rendered: string;
  };
  alt_text: string;
  media_type: string;
  mime_type: string;
  media_details: MediaDetails;
  source_url: string;
}

// Content types
export interface Post extends WPEntity {
  title: RenderedTitle;
  content: RenderedContent;
  excerpt: RenderedContent;
  author: number;
  featured_media: number;
  comment_status: "open" | "closed";
  ping_status: "open" | "closed";
  sticky: boolean;
  template: string;
  format:
    | "standard"
    | "aside"
    | "chat"
    | "gallery"
    | "link"
    | "image"
    | "quote"
    | "status"
    | "video"
    | "audio";
  categories: number[];
  tags: number[];
  meta: Record<string, unknown>;
  rank_math_seo?: RankMathSeoData; // Hinzugefügt
  _embedded?: {
    author?: Author[];
    'wp:featuredmedia'?: FeaturedMedia[];
    'wp:term'?: (Category[] | Tag[])[];
  };
}

export interface Page extends WPEntity {
  title: RenderedTitle;
  content: RenderedContent;
  excerpt: RenderedContent;
  author: number;
  featured_media: number;
  parent: number;
  menu_order: number;
  comment_status: "open" | "closed";
  ping_status: "open" | "closed";
  template: string;
  meta: Record<string, unknown>;
  rank_math_seo?: RankMathSeoData; // Hinzugefügt
}

// Taxonomy types
interface Taxonomy {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  meta: Record<string, unknown>;
}

export interface Category extends Taxonomy {
  taxonomy: "category";
  parent: number;
}

// --- Custom Taxonomies for Haendler ---
export interface Brand extends Taxonomy {
  taxonomy: "brand";
  parent: number;
}

export interface ProductCategory extends Taxonomy {
  taxonomy: "product_category";
  parent: number;
}

// Interface for the Team Member Custom Post Type
export interface TeamMember {
  id: number;
  slug: string;
  title: {
    rendered: string; // Name of the team member
  };
  content: {
    rendered: string; // Biography/description
  };
  _embedded: {
    'wp:featuredmedia'?: {
      id: number;
      source_url: string;
      alt_text: string;
    }[];
  };
  acf: {
    position?: string;
    email?: string;
    phone?: string;
    linkedin_url?: string;
    twitter_url?: string;
    instagram_url?: string;
    facebook_url?: string;
  };
}

// Interface for the Haendler Custom Post Type
export interface Haendler extends WPEntity {
  title: RenderedTitle; // Firmenname
  content: RenderedContent; // Unternehmensbeschreibung
  featured_media: number; // Logo
  brands: number[]; // Taxonomy IDs
  product_categories: number[]; // Taxonomy IDs
  acf: {
    ansprechpartner?: string;
    webseite?: string;
    phone_number?: string;
    address?: string;
  };
  _embedded?: {
    author?: Author[];
    'wp:featuredmedia'?: FeaturedMedia[];
    'wp:term'?: (Brand[] | ProductCategory[])[];
  };
}

export interface RankMathHead {
  title: string;
  description: string;
  robots: string;
  og_title: string;
  og_description: string;
  og_image: { url: string }[];
}

export interface Tag extends Taxonomy {
  taxonomy: "post_tag";
}

export interface Author {
  id: number;
  name: string;
  url: string;
  description: string;
  link: string;
  slug: string;
  avatar_urls: Record<string, string>;
  meta: Record<string, unknown>;
}

// --- HIER BEGINNEN DIE NEUEN TYPEN FÜR RANK MATH SEO ---
export interface RankMathSeoData {
  title?: string;
  description?: string;
  canonical?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  og_url?: string;
  og_type?: string;
  twitter_card_type?: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
  // Füge hier weitere Felder hinzu, falls dein Plugin mehr bereitstellt
}
// --- HIER ENDEN DIE NEUEN TYPEN FÜR RANK MATH SEO ---


// Block types
interface BlockSupports {
  align?: boolean | string[];
  anchor?: boolean;
  className?: boolean;
  color?: {
    background?: boolean;
    gradients?: boolean;
    text?: boolean;
  };
  spacing?: {
    margin?: boolean;
    padding?: boolean;
  };
  typography?: {
    fontSize?: boolean;
    lineHeight?: boolean;
  };
  [key: string]: unknown;
}

interface BlockStyle {
  name: string;
  label: string;
  isDefault: boolean;
}

export interface BlockType {
  api_version: number;
  title: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  keywords: string[];
  parent: string[];
  supports: BlockSupports;
  styles: BlockStyle[];
  textdomain: string;
  example: Record<string, unknown>;
  attributes: Record<string, unknown>;
  provides_context: Record<string, string>;
  uses_context: string[];
  editor_script: string;
  script: string;
  editor_style: string;
  style: string;
}

export interface EditorBlock {
  id: string;
  name: string;
  attributes: Record<string, unknown>;
  innerBlocks: EditorBlock[];
  innerHTML: string;
  innerContent: string[];
}

export interface TemplatePart {
  id: string;
  slug: string;
  theme: string;
  type: string;
  source: string;
  origin: string;
  content: string | EditorBlock[];
  title: {
    raw: string;
    rendered: string;
  };
  description: string;
  status: "publish" | "future" | "draft" | "pending" | "private";
  wp_id: number;
  has_theme_file: boolean;
  author: number;
  area: string;
}

export interface SearchResult {
  id: number;
  title: string;
  url: string;
  type: string;
  subtype: string;
  _links: {
    self: Array<{
      embeddable: boolean;
      href: string;
    }>;
    about: Array<{
      href: string;
    }>;
  };
}

// Component Props Types
export interface FilterBarProps {
  authors: Author[];
  tags: Tag[];
  categories: Category[];
  selectedAuthor?: Author["id"];
  selectedTag?: Tag["id"];
  selectedCategory?: Category["id"];
  onAuthorChange?: (authorId: Author["id"] | undefined) => void;
  onTagChange?: (tagId: Tag["id"] | undefined) => void;
  onCategoryChange?: (categoryId: Category["id"] | undefined) => void;
}
