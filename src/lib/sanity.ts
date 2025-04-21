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
    throw new Error(
      `Missing required Sanity configuration: ${missingVars.join(', ')}. ` +
      'Please check your environment variables.'
    );
  }
};

// Create a Sanity client with validation
export const createSanityClient = () => {
  try {
    validateConfig();
    
    return createClient({
      projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
      dataset: import.meta.env.VITE_SANITY_DATASET,
      apiVersion: '2023-05-03',
      useCdn: process.env.NODE_ENV === 'production',
      token: import.meta.env.VITE_SANITY_TOKEN,
    });
  } catch (error) {
    console.error('Failed to initialize Sanity client:', error);
    // Return a dummy client that throws helpful errors
    return new Proxy({}, {
      get: () => () => {
        throw new Error(
          'Sanity client is not properly configured. ' +
          'Please ensure all required environment variables are set.'
        );
      }
    });
  }
};

export const sanityClient = createSanityClient();

// Set up image URL builder
const builder = imageUrlBuilder(sanityClient);

// Helper function to generate image URLs
export const urlFor = (source: SanityImageSource) => {
  return builder.image(source);
};

// Helper function to handle errors
export const handleSanityError = (error: any) => {
  console.error('Sanity error:', error);
  
  // Check if it's a configuration error
  if (error.message?.includes('configuration')) {
    return { 
      error: 'CMS configuration error. Please contact support.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
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
    details: process.env.NODE_ENV === 'development' ? error.message : undefined
  };
};