// Enhanced Google Analytics 4 Setup for JDM HEAVEN

interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  [key: string]: any;
}

// Initialize Google Analytics
export const initializeAnalytics = () => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  
  if (!measurementId) {
    console.warn('Google Analytics Measurement ID not found');
    return;
  }

  // Load Google Analytics
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(args);
  }
  
  (window as any).gtag = gtag;
  gtag('js', new Date());
  gtag('config', measurementId, {
    page_path: window.location.pathname,
    send_page_view: true,
  });
};

// Track page views
export const trackPageView = (path: string, title?: string) => {
  if ((window as any).gtag) {
    (window as any).gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
      page_path: path,
      page_title: title,
    });
  }
};

// Track custom events
export const trackEvent = (
  category: string,
  action: string,
  label?: string,
  value?: number,
  additionalParams?: Record<string, any>
) => {
  if ((window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
      ...additionalParams,
    });
  }
};

// ============================================
// JDM HEAVEN Specific Event Tracking
// ============================================

// Car/Inventory Events
export const trackCarView = (carId: string, carName: string, price: number) => {
  trackEvent('Car', 'view', carName, price, {
    car_id: carId,
    currency: 'EUR',
  });
};

export const trackCarInquiry = (carId: string, carName: string, inquiryType: string) => {
  trackEvent('Car', 'inquiry', `${carName} - ${inquiryType}`, undefined, {
    car_id: carId,
    inquiry_type: inquiryType,
  });
};

export const trackCarWishlist = (carId: string, action: 'add' | 'remove') => {
  trackEvent('Car', `wishlist_${action}`, carId);
};

export const trackCarCompare = (carId: string, action: 'add' | 'remove') => {
  trackEvent('Car', `compare_${action}`, carId);
};

export const trackCarShare = (carId: string, method: string) => {
  trackEvent('Car', 'share', carId, undefined, {
    share_method: method,
  });
};

// Filter Events
export const trackFilterUse = (filterType: string, filterValue: string) => {
  trackEvent('Filter', 'use', `${filterType}: ${filterValue}`);
};

export const trackFilterReset = () => {
  trackEvent('Filter', 'reset');
};

export const trackFilterSave = (filterName: string) => {
  trackEvent('Filter', 'save', filterName);
};

// Search Events
export const trackSearch = (query: string, resultsCount: number) => {
  trackEvent('Search', 'query', query, resultsCount, {
    search_term: query,
    results_count: resultsCount,
  });
};

export const trackSearchSuggestion = (suggestion: string) => {
  trackEvent('Search', 'suggestion_click', suggestion);
};

// Calculator Events
export const trackImportCalculator = (destination: string, totalCost: number) => {
  trackEvent('Calculator', 'import_cost', destination, totalCost, {
    destination_country: destination,
    total_cost: totalCost,
    currency: 'EUR',
  });
};

export const trackShippingCalculator = (origin: string, destination: string, cost: number) => {
  trackEvent('Calculator', 'shipping_cost', `${origin} to ${destination}`, cost);
};

export const trackFinancingCalculator = (loanAmount: number, term: number, monthlyPayment: number) => {
  trackEvent('Calculator', 'financing', `${term} months`, monthlyPayment, {
    loan_amount: loanAmount,
    term_months: term,
    monthly_payment: monthlyPayment,
  });
};

// User Journey Events
export const trackSignUp = (method: string) => {
  trackEvent('User', 'sign_up', method);
};

export const trackSignIn = (method: string) => {
  trackEvent('User', 'sign_in', method);
};

export const trackCustomRequest = (make: string, model?: string) => {
  trackEvent('Request', 'custom', `${make} ${model || ''}`.trim());
};

export const trackQuoteRequest = (carId?: string) => {
  trackEvent('Request', 'quote', carId || 'general');
};

// Conversion Events
export const trackConversion = (type: 'inquiry' | 'quote' | 'purchase', value?: number) => {
  trackEvent('Conversion', type, undefined, value, {
    conversion_type: type,
    currency: 'EUR',
  });
};

// Engagement Events
export const trackTimeOnPage = (page: string, seconds: number) => {
  if (seconds > 30) { // Only track meaningful engagement
    trackEvent('Engagement', 'time_on_page', page, seconds);
  }
};

export const trackScrollDepth = (page: string, depth: number) => {
  if (depth >= 75) { // Track when user scrolls 75% or more
    trackEvent('Engagement', 'scroll_depth', page, depth);
  }
};

// Error Tracking
export const trackError = (error: string, page: string) => {
  trackEvent('Error', 'occurred', `${page}: ${error}`);
};

// Performance Tracking
export const trackPerformance = (metric: string, value: number) => {
  trackEvent('Performance', metric, undefined, value);
};

// Export all tracking functions
export const analytics = {
  // Core
  initialize: initializeAnalytics,
  pageView: trackPageView,
  event: trackEvent,
  
  // Car/Inventory
  carView: trackCarView,
  carInquiry: trackCarInquiry,
  carWishlist: trackCarWishlist,
  carCompare: trackCarCompare,
  carShare: trackCarShare,
  
  // Filter
  filterUse: trackFilterUse,
  filterReset: trackFilterReset,
  filterSave: trackFilterSave,
  
  // Search
  search: trackSearch,
  searchSuggestion: trackSearchSuggestion,
  
  // Calculators
  importCalculator: trackImportCalculator,
  shippingCalculator: trackShippingCalculator,
  financingCalculator: trackFinancingCalculator,
  
  // User Journey
  signUp: trackSignUp,
  signIn: trackSignIn,
  customRequest: trackCustomRequest,
  quoteRequest: trackQuoteRequest,
  
  // Conversion
  conversion: trackConversion,
  
  // Engagement
  timeOnPage: trackTimeOnPage,
  scrollDepth: trackScrollDepth,
  
  // Error & Performance
  error: trackError,
  performance: trackPerformance,
};
