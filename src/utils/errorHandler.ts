/**
 * Common error handling utilities
 */

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
  retryable?: boolean;
}

/**
 * Standard error handler for API calls
 */
export function handleApiError(error: unknown): ApiError {
  if (error instanceof Error) {
    // Check for Supabase errors
    if ('code' in error && 'message' in error) {
      const supabaseError = error as { code?: string; message: string; details?: unknown };
      return {
        message: supabaseError.message || 'An error occurred',
        code: supabaseError.code,
        details: supabaseError.details,
        retryable: isRetryableError(supabaseError.code),
      };
    }
    
    return {
      message: error.message,
      retryable: true,
    };
  }
  
  if (typeof error === 'string') {
    return {
      message: error,
      retryable: true,
    };
  }
  
  return {
    message: 'An unexpected error occurred',
    retryable: true,
  };
}

/**
 * Check if an error code indicates a retryable error
 */
function isRetryableError(code?: string): boolean {
  if (!code) return true;
  
  // Network errors are retryable
  const retryableCodes = ['PGRST301', 'PGRST116', 'NETWORK_ERROR', 'API_ERROR'];
  return retryableCodes.includes(code);
}

/**
 * Wrapper for async functions with error handling
 */
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  errorMessage = 'Operation failed'
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    const apiError = handleApiError(error);
    console.error(errorMessage, apiError);
    throw new Error(apiError.message || errorMessage);
  }
}

/**
 * Safe async function wrapper that returns null on error
 */
export async function safeAsync<T>(
  fn: () => Promise<T>,
  defaultValue: T | null = null
): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    console.error('Safe async error:', error);
    return defaultValue;
  }
}

