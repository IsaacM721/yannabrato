import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
    .replace(/\-\-+/g, '-');     // Replace multiple - with single -
}

export const PREDEFINED_ORDER = [
  "creative direction & choreography",
  "production & event management",
  "postproduction"
];

export function sortCategories(a: string, b: string): number {
  const normalize = (cat: string) => cat.toLowerCase().trim();
  const aNorm = normalize(a);
  const bNorm = normalize(b);
  
  const aIndex = PREDEFINED_ORDER.indexOf(aNorm);
  const bIndex = PREDEFINED_ORDER.indexOf(bNorm);

  if (aIndex !== -1 && bIndex !== -1) {
    return aIndex - bIndex;
  }
  if (aIndex !== -1) return -1;
  if (bIndex !== -1) return 1;
  
  return a.localeCompare(b);
}
