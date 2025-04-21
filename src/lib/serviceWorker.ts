// Register service worker
export const registerServiceWorker = async () => {
  // Skip registration in development or unsupported environments
  if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });
    
    if (registration.installing) {
      console.log('Service worker installing');
    } else if (registration.waiting) {
      console.log('Service worker installed');
    } else if (registration.active) {
      console.log('Service worker active');
    }
    
    return registration;
  } catch (error) {
    console.error('Service worker registration failed:', error);
  }
};

// Unregister service worker
export const unregisterServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.unregister();
      return true;
    } catch (error) {
      console.error('Service worker unregistration failed:', error);
      return false;
    }
  }
  return false;
};