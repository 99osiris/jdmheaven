import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

// Validate required environment variables
const validateConfig = () => {
  const requiredVars = {
    projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
    dataset: import.meta.env.VITE_SANITY_DATASET,
    token: import.meta.env.VITE_SANITY_TOKEN
  };

  const missingVars = Object.entries(requiredVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    console.warn(
      `Missing required Sanity configuration: ${missingVars.join(', ')}. ` +
      'Please check your environment variables. CMS features will be disabled.'
    );
    return false;
  }

  return true;
};

// Create a fallback client that returns empty data instead of throwing errors
const createFallbackClient = () => {
  return {
    fetch: () => Promise.resolve(null),
    // Add other methods as needed
  } as any;
};

// Create a Sanity client with validation
export const createSanityClient = () => {
  try {
    const isConfigValid = validateConfig();
    
    if (!isConfigValid) {
      return createFallbackClient();
    }
    
    return createClient({
      projectId: import.meta.env.VITE_SANITY_PROJECT_ID || '',
      dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
      apiVersion: '2023-05-03',
      useCdn: import.meta.env.PROD,
      token: import.meta.env.VITE_SANITY_TOKEN,
    });
  } catch (error) {
    console.error('Failed to initialize Sanity client:', error);
    return createFallbackClient();
  }
};

export const sanityClient = createSanityClient();

// Set up image URL builder
let builder: ReturnType<typeof imageUrlBuilder> | null = null;
try {
  builder = imageUrlBuilder(sanityClient);
} catch (error) {
  console.warn('Failed to initialize Sanity image builder:', error);
}

// Helper function to generate image URLs
export const urlFor = (source: SanityImageSource) => {
  if (!builder || !source) {
    return {
      url: () => '',
      width: () => ({ url: () => '', height: () => ({ url: () => '' }) }),
      height: () => ({ url: () => '' }),
      auto: () => ({ url: () => '', fit: () => ({ quality: () => ({ url: () => '' }) }) }),
      fit: () => ({ quality: () => ({ url: () => '' }) }),
      quality: () => ({ url: () => '' }),
    };
  }
  
  try {
    return builder.image(source);
  } catch (error) {
    console.error('Error creating image URL:', error);
    return {
      url: () => '',
      width: () => ({ url: () => '', height: () => ({ url: () => '' }) }),
      height: () => ({ url: () => '' }),
      auto: () => ({ url: () => '', fit: () => ({ quality: () => ({ url: () => '' }) }) }),
      fit: () => ({ quality: () => ({ url: () => '' }) }),
      quality: () => ({ url: () => '' }),
    };
  }
};

// Helper function to handle errors
export const handleSanityError = (error: any) => {
  console.error('Sanity error:', error);
  
  // Check if it's a configuration error
  if (error.message?.includes('configuration')) {
    return { 
      error: 'CMS configuration error. Please contact support.',
      details: import.meta.env.DEV ? error.message : undefined
    };
  }
  
  // Check if it's a network error
  if (!navigator.onLine) {
    return { error: 'Network connection lost. Please check your internet connection.' };
  }

  // Check for specific Sanity error types
  if (error.statusCode === 401) {
    return { error: 'Unable to access content. Please check API credentials.' };
  } else if (error.statusCode === 404) {
    return { error: 'Content not found.' };
  } else if (error.name === 'SanityClientError') {
    return { error: 'Error connecting to CMS. Please try again later.' };
  }

  // Generic error with more context
  return { 
    error: 'Unable to load content. Please try again later.',
      details: import.meta.env.DEV ? error.message : undefined
  };
};