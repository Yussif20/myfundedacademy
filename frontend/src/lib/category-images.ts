/**
 * Editorial photos for the demo categories (public/images/categories). Categories without
 * a photo keep their icon.
 */
const PHOTOS: Record<string, string> = {
  "web-development": "/images/categories/web-development.jpg",
  design: "/images/categories/design.jpg",
  "arabic-calligraphy": "/images/categories/arabic-calligraphy.jpg",
  business: "/images/categories/business.jpg",
  languages: "/images/categories/languages.jpg",
};

export function categoryImage(slug: string): string | undefined {
  return PHOTOS[slug];
}
