import { sanityClient, urlFor, handleSanityError } from './sanity-client';
import groq from 'groq';
import { deferOperation } from '../utils/performance';

// Cache for CMS data
const cmsCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Helper to check if cache is valid
const isCacheValid = (key: string) => {
  const cached = cmsCache.get(key);
  if (!cached) return false;
  return Date.now() - cached.timestamp < CACHE_TTL;
};

// Generic fetch function with caching
const fetchWithCache = async <T>(
  query: string,
  params?: Record<string, any>,
  forceFresh = false
): Promise<T> => {
  const cacheKey = JSON.stringify({ query, params });
  
  // Return cached data if valid and not forcing fresh
  if (!forceFresh && isCacheValid(cacheKey)) {
    return cmsCache.get(cacheKey)!.data as T;
  }
  
  try {
    const data = await sanityClient.fetch<T>(query, params);
    
    // Update cache
    cmsCache.set(cacheKey, {
      data,
      timestamp: Date.now(),
    });
    
    return data;
  } catch (error) {
    const errorResult = handleSanityError(error);
    throw new Error(errorResult.error);
  }
};

// CMS API
export const cmsClient = {
  // Hero section
  getHero: async () => {
    const query = groq`*[_type == "hero"][0]{
      title,
      subtitle,
      "backgroundImage": backgroundImage.asset->url,
      ctaPrimary,
      ctaSecondary,
      ctaPrimaryLink,
      ctaSecondaryLink
    }`;
    
    return fetchWithCache<any>(query);
  },
  
  // Testimonials
  getTestimonials: async () => {
    const query = groq`*[_type == "testimonial"] | order(order asc) {
      _id,
      name,
      role,
      quote,
      "image": image.asset->url
    }`;
    
    return fetchWithCache<any[]>(query);
  },
  
  // Gallery
  getGallery: async (category?: string) => {
    let query = groq`*[_type == "galleryImage"`;
    
    if (category) {
      query += ` && category == "${category}"`;
    }
    
    query += `] | order(order asc) {
      _id,
      title,
      description,
      "imageUrl": image.asset->url,
      category,
      order
    }`;
    
    return fetchWithCache<any[]>(query);
  },
  
  // Blog posts
  getBlogPosts: async (limit = 10, offset = 0) => {
    const query = groq`{
      "posts": *[_type == "post"] | order(publishedAt desc) [${offset}...${offset + limit}] {
        _id,
        title,
        slug,
        excerpt,
        "mainImage": mainImage.asset->url,
        publishedAt,
        "categories": categories[]->title,
        "author": author->{name, "image": image.asset->url}
      },
      "total": count(*[_type == "post"])
    }`;
    
    return fetchWithCache<{ posts: any[]; total: number }>(query);
  },
  
  // Single blog post
  getBlogPost: async (slug: string) => {
    const query = groq`*[_type == "post" && slug.current == $slug][0]{
      _id,
      title,
      slug,
      body,
      "mainImage": mainImage.asset->url,
      publishedAt,
      "categories": categories[]->title,
      "author": author->{name, "image": image.asset->url},
      "relatedPosts": *[_type == "post" && slug.current != $slug] | order(publishedAt desc) [0...3] {
        _id,
        title,
        slug,
        "mainImage": mainImage.asset->url,
        publishedAt
      }
    }`;
    
    return fetchWithCache<any>(query, { slug });
  },
  
  // Featured cars
  getFeaturedCars: async () => {
    const query = groq`*[_type == "featuredCar"] | order(order asc) {
      _id,
      title,
      make,
      model,
      year,
      price,
      "imageUrl": image.asset->url,
      description,
      specs,
      referenceId
    }`;
    
    return fetchWithCache<any[]>(query);
  },
  
  // JDM Legends for carousel
  getJdmLegends: async () => {
    const query = groq`*[_type == "jdmLegend"] | order(order asc) {
      _id,
      name,
      description,
      "imageUrl": image.asset->url,
      year,
      specs
    }`;
    
    return fetchWithCache<any[]>(query);
  },
  
  // Services
  getServices: async () => {
    const query = groq`*[_type == "service"] | order(order asc) {
      _id,
      title,
      description,
      icon
    }`;
    
    return fetchWithCache<any[]>(query);
  },
  
  // Prefetch common data
  prefetchCommonData: () => {
    deferOperation(async () => {
      try {
        await Promise.all([
          cmsClient.getHero(),
          cmsClient.getTestimonials(),
          cmsClient.getFeaturedCars(),
          cmsClient.getJdmLegends(),
          cmsClient.getServices(),
          cmsClient.getBlogPosts(3, 0)
        ]);
        console.log('Prefetched common CMS data');
      } catch (error) {
        console.error('Error prefetching CMS data:', error);
      }
    });
  },
  
  // Clear cache
  clearCache: () => {
    cmsCache.clear();
  }
};