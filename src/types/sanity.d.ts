// Sanity image type
export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  crop?: {
    _type: 'sanity.imageCrop';
    bottom: number;
    left: number;
    right: number;
    top: number;
  };
  hotspot?: {
    _type: 'sanity.imageHotspot';
    height: number;
    width: number;
    x: number;
    y: number;
  };
}

// Sanity reference type
export interface SanityReference {
  _type: 'reference';
  _ref: string;
}

// Sanity slug type
export interface SanitySlug {
  _type: 'slug';
  current: string;
}

// Sanity block content
export interface SanityBlock {
  _key: string;
  _type: 'block';
  children: {
    _key: string;
    _type: 'span';
    marks: string[];
    text: string;
  }[];
  markDefs: {
    _key: string;
    _type: string;
    href?: string;
  }[];
  style: string;
}

// Sanity portable text
export type PortableText = Array<SanityBlock | SanityImage>;

// Blog post type
export interface SanityBlogPost {
  _id: string;
  _createdAt: string;
  title: string;
  slug: SanitySlug;
  excerpt?: string;
  mainImage?: SanityImage;
  body: PortableText;
  author?: SanityReference;
  categories?: SanityReference[];
  publishedAt: string;
}

// Author type
export interface SanityAuthor {
  _id: string;
  name: string;
  image?: SanityImage;
  bio?: PortableText;
}

// Category type
export interface SanityCategory {
  _id: string;
  title: string;
  description?: string;
}

// Gallery image type
export interface SanityGalleryImage {
  _id: string;
  title: string;
  description?: string;
  image: SanityImage;
  category?: string;
  order: number;
}

// Testimonial type
export interface SanityTestimonial {
  _id: string;
  name: string;
  role: string;
  quote: string;
  image?: SanityImage;
  order: number;
}

// Featured car type
export interface SanityFeaturedCar {
  _id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  image: SanityImage;
  description: string;
  specs: string[];
  referenceId: string;
  order: number;
}

// JDM Legend type
export interface SanityJdmLegend {
  _id: string;
  name: string;
  description: string;
  image: SanityImage;
  year: string;
  specs: string[];
  order: number;
}

// Service type
export interface SanityService {
  _id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

// Hero type
export interface SanityHero {
  _id: string;
  title: string;
  subtitle: string;
  backgroundImage: SanityImage;
  ctaPrimary: string;
  ctaSecondary: string;
  ctaPrimaryLink: string;
  ctaSecondaryLink: string;
}