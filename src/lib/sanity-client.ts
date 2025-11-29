/**
 * @deprecated Use './sanity' instead
 * This file is kept for backward compatibility
 * All exports are re-exported from './sanity'
 */

export {
  sanityClient,
  createSanityClient,
  urlFor,
  handleSanityError,
  handleSanityErrorAsync,
  withRetry,
  validateSanityResponse,
} from './sanity';
