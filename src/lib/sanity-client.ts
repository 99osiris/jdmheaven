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
      'Please check your environment variables.'
    );
    return false;
  }

  return true;
};

// Create a Sanity client with validation
export const createSanityClient = () => {
  try {
    const isConfigValid = validateConfig();
    
    if (!isConfigValid) {
      // Return a dummy client that provides fallback behavior
      return createFallbackClient();
    }
    
    return createClient({
      projectId: import.meta.env.VITE_SANITY_PROJECT_ID || '',
      dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
      apiVersion: '2023-05-03',
      useCdn: import.meta.env.PROD, // Only use CDN in production
      token: import.meta.env.VITE_SANITY_TOKEN,
      perspective: 'published',
      // Add timeout and retry options
      requestTimeout: 10000, // 10 seconds
    });
  } catch (error) {
    console.error('Failed to initialize Sanity client:', error);
    // Return a dummy client that provides fallback behavior
    return createFallbackClient();
  }
};

// Create a fallback client that returns empty data instead of throwing errors
const createFallbackClient = () => {
  return {
    fetch: () => Promise.resolve(null),
    // Add other methods as needed
  };
};

export const sanityClient = createSanityClient();

// Set up image URL builder
const builder = createImageUrlBuilder(sanityClient);

// Helper function to generate image URLs
export const urlFor = (source: SanityImageSource) => {
  if (!source) {
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

// Helper function to check internet connectivity
const checkConnectivity = async () => {
  // First check navigator.onLine
  if (!navigator.onLine) {
    return false;
  }

  // Then try to fetch a small resource from our own origin
  try {
    // Use the current origin instead of an external URL
    const url = new URL('/manifest.json', window.location.origin);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url.toString(), {
      method: 'HEAD',
      signal: controller.signal,
      cache: 'no-cache'
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.warn('Connectivity check failed:', error);
    return navigator.onLine; // Fallback to navigator.onLine if fetch fails
  }
};

// Helper function to handle errors
export const handleSanityError = async (error: any) => {
  console.error('Sanity error:', error);

  // Check internet connectivity first
  const isOnline = await checkConnectivity();
  if (!isOnline) {
    return {
      error: 'No internet connection. Please check your network and try again.',
      code: 'NETWORK_ERROR',
      retryable: true
    };
  }
  
  // Check if it's a configuration error
  if (error.message?.includes('configuration') || error.message?.includes('environment')) {
    return { 
      error: 'CMS configuration error. Please check environment variables.',
      details: import.meta.env.DEV ? error.message : undefined,
      code: 'CONFIG_ERROR',
      retryable: false
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

  // Generic error with more context in development
  return { 
    error: 'Unable to load content. Please try again later.',
    details: import.meta.env.DEV ? error.message : undefined,
    code: 'UNKNOWN_ERROR',
    retryable: true
  };
};

// Helper function to check if error is retryable
export const isRetryableError = async (error: any) => {
  const errorInfo = await handleSanityError(error);
  return errorInfo.retryable;
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
      
      if (!await isRetryableError(error) || attempt === maxRetries - 1) {
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