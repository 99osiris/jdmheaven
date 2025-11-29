/**
 * Type definitions for Sanity CMS data structures
 */

export interface SanityImage {
  asset: {
    _ref?: string;
    _type?: string;
    url?: string;
  };
  alt?: string;
  isPrimary?: boolean;
}

export interface SanityCarSpecs {
  engine?: string;
  displacement?: number;
  induction?: string;
  power?: number;
  torque?: number;
  zeroToHundred?: string;
  topSpeed?: string;
  weight?: string;
  drivetrain?: string;
  transmission?: string;
  fuelType?: string;
  fuelConsumption?: string;
}

export interface SanityMaintenanceRecord {
  date: string;
  description: string;
  cost?: number;
}

export interface SanityCar {
  _id: string;
  _type: 'car';
  title?: string;
  slug?: {
    current?: string;
  };
  stockNumber?: string;
  brand?: string;
  model?: string;
  year?: number;
  vin?: string;
  chassisCode?: string;
  bodyType?: string;
  exteriorColor?: string;
  interiorColor?: string;
  condition?: string;
  status?: 'available' | 'reserved' | 'sold';
  importStatus?: string;
  location?: string;
  description?: string;
  images?: SanityImage[];
  specs?: SanityCarSpecs;
  basePrice?: number;
  importTax?: number;
  shippingCost?: number;
  finalPrice?: number;
  negotiable?: boolean;
  featured?: boolean;
  hotImport?: boolean;
  freshArrival?: boolean;
  rareUnit?: boolean;
  maintenanceRecords?: SanityMaintenanceRecord[];
  createdAt?: string;
  updatedAt?: string;
}

export interface SanityHero {
  title?: string;
  subtitle?: string;
  backgroundImage?: SanityImage;
  ctaPrimary?: string;
  ctaSecondary?: string;
  ctaPrimaryLink?: string;
  ctaSecondaryLink?: string;
}

export interface SanityTestimonial {
  _id: string;
  name?: string;
  role?: string;
  quote?: string;
  image?: SanityImage;
  order?: number;
}

export interface SanityGalleryImage {
  _id: string;
  title?: string;
  description?: string;
  image?: SanityImage;
  category?: string;
  order?: number;
}

export interface SanityBlogPost {
  _id: string;
  title?: string;
  slug?: {
    current?: string;
  };
  excerpt?: string;
  mainImage?: SanityImage;
  publishedAt?: string;
  categories?: Array<{ title?: string }>;
  author?: {
    name?: string;
    image?: SanityImage;
  };
  body?: unknown;
}

export interface SanityFeaturedCar {
  _id: string;
  title?: string;
  make?: string;
  model?: string;
  year?: number;
  price?: number;
  image?: SanityImage;
  description?: string;
  specs?: SanityCarSpecs;
  referenceId?: string;
  order?: number;
}

export interface SanityJdmLegend {
  _id: string;
  name?: string;
  description?: string;
  image?: SanityImage;
  year?: number;
  specs?: SanityCarSpecs;
  order?: number;
}

export interface SanityService {
  _id: string;
  title?: string;
  description?: string;
  icon?: string;
  order?: number;
}

