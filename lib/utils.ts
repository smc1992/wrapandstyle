import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')       // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-')   // Replace multiple - with single -
    .replace(/^-+/, '')      // Trim - from start of text
    .replace(/-+$/, '');     // Trim - from end of text
}

export function formatDate(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('de-DE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}
