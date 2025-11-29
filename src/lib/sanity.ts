import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

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
      dataset: import.meta.env.VITE_SANITY_DATASET || 'car-inventory',
      apiVersion: '2023-05-03',
      useCdn: import.meta.env.PROD,
      token: import.meta.env.VITE_SANITY_TOKEN,
      perspective: 'published',
      requestTimeout: 10000, // 10 seconds
    });
  } catch (error) {
    console.error('Failed to initialize Sanity client:', error);
    return createFallbackClient();
  }
};

export const sanityClient = createSanityClient();

// Set up image URL builder
let builder: ReturnType<typeof createImageUrlBuilder> | null = null;
try {
  builder = createImageUrlBuilder(sanityClient);
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

export interface SanityErrorInfo {
  error: string;
  code?: string;
  details?: string;
  retryable: boolean;
}

// Helper function to handle errors (synchronous version for compatibility)
export const handleSanityError = (error: unknown): SanityErrorInfo => {
  console.error('Sanity error:', error);
  
  // Check if it's a configuration error
  if (error.message?.includes('configuration') || error.message?.includes('environment')) {
    return { 
      error: 'CMS configuration error. Please check environment variables.',
      details: import.meta.env.DEV ? error.message : undefined,
      code: 'CONFIG_ERROR',
      retryable: false
    };
  }
  
  // Check if it's a network error
  if (!navigator.onLine) {
    return { 
      error: 'Network connection lost. Please check your internet connection.',
      code: 'NETWORK_ERROR',
      retryable: true
    };
  }

  // Check for specific Sanity error types
  if (error.statusCode === 401 || error.message?.includes('unauthorized')) {
    return { 
      error: 'Unable to access content. Please check API credentials.',
      code: 'AUTH_ERROR',
      retryable: false
    };
  } else if (error.statusCode === 404) {
    return { 
      error: 'Content not found.',
      code: 'NOT_FOUND',
      retryable: false
    };
  } else if (error.name === 'SanityClientError') {
    return { 
      error: 'Error connecting to CMS. Please try again later.',
      code: 'API_ERROR',
      retryable: true
    };
  }

  // Generic error with more context
  return { 
    error: 'Unable to load content. Please try again later.',
    details: import.meta.env.DEV ? error.message : undefined,
    code: 'UNKNOWN_ERROR',
    retryable: true
  };
};

// Async version for advanced error handling (optional)
export const handleSanityErrorAsync = async (error: unknown): Promise<SanityErrorInfo> => {
  // For now, just return the sync version
  // Can be enhanced with connectivity checks if needed
  return handleSanityError(error);
};

// Helper function to implement retry logic with exponential backoff
export const withRetry = async (
  fn: () => Promise<any>,
  maxRetries = 3,
  initialDelay = 1000
) => {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const errorInfo = handleSanityError(error);
      
      if (!errorInfo.retryable || attempt === maxRetries - 1) {
        throw error;
      }
      
      // Exponential backoff with jitter
      const delay = initialDelay * Math.pow(2, attempt) * (0.5 + Math.random());
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

// Helper function to validate Sanity response
export const validateSanityResponse = <T>(data: T | null): T => {
  if (!data) {
    throw new Error('No content found');
  }
  return data;
};