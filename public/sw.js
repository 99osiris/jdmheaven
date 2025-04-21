// Service Worker version
const CACHE_VERSION = 'v1';
const CACHE_NAME = `jdm-heaven-${CACHE_VERSION}`;

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.png',
  '/logo-icon.png',
];

// Install event - precache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name.startsWith('jdm-heaven-') && name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Helper function to determine if a request is an API call
const isApiRequest = (url) => {
  return url.pathname.startsWith('/api/') || 
         url.hostname.includes('supabase.co');
};

// Helper function to determine if a request is for a static asset
const isStaticAsset = (url) => {
  const staticExtensions = [
    '.js', '.css', '.png', '.jpg', '.jpeg', '.gif', 
    '.svg', '.ico', '.woff', '.woff2', '.ttf', '.eot'
  ];
  
  return staticExtensions.some(ext => url.pathname.endsWith(ext));
};

// Fetch event - network first for API, cache first for static assets
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Skip cross-origin requests
  if (url.origin !== self.location.origin && !url.hostname.includes('unsplash.com')) {
    return;
  }
  
  // Network-first strategy for API requests
  if (isApiRequest(url)) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache a copy of the response
          const clonedResponse = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clonedResponse);
          });
          return response;
        })
        .catch(() => {
          // If network fails, try the cache
          return caches.match(event.request);
        })
    );
    return;
  }
  
  // Cache-first strategy for static assets
  if (isStaticAsset(url) || url.pathname === '/') {
    event.respondWith(
      caches.match(event.request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            // Return cached response and update cache in background
            const fetchPromise = fetch(event.request)
              .then((networkResponse) => {
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(event.request, networkResponse.clone());
                });
                return networkResponse;
              })
              .catch(() => {
                // Network failed, but we already have a cached response
                console.log('Network fetch failed, but returning cached response');
              });
              
            // Update cache in background
            event.waitUntil(fetchPromise);
            
            // Return cached response immediately
            return cachedResponse;
          }
          
          // If not in cache, fetch from network and cache
          return fetch(event.request)
            .then((response) => {
              const clonedResponse = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, clonedResponse);
              });
              return response;
            });
        })
    );
    return;
  }
  
  // Network-first with cache fallback for everything else
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache a copy of the response
        const clonedResponse = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, clonedResponse);
        });
        return response;
      })
      .catch(() => {
        // If network fails, try the cache
        return caches.match(event.request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // If it's a navigation request, return the offline page
            if (event.request.mode === 'navigate') {
              return caches.match('/');
            }
            
            // Otherwise, just fail
            return new Response('Network error', {
              status: 408,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});

// Background sync for offline form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'contact-form-sync') {
    event.waitUntil(syncContactForms());
  }
});

// Function to sync contact forms that were submitted offline
async function syncContactForms() {
  try {
    // Open the IndexedDB database
    const db = await openDatabase();
    
    // Get all pending form submissions
    const pendingForms = await getAllPendingForms(db);
    
    // Process each form
    const syncPromises = pendingForms.map(async (form) => {
      try {
        // Try to submit the form
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(form.data)
        });
        
        if (response.ok) {
          // If successful, remove from pending
          await deleteForm(db, form.id);
          return { success: true, id: form.id };
        } else {
          return { success: false, id: form.id };
        }
      } catch (error) {
        console.error('Error syncing form:', error);
        return { success: false, id: form.id };
      }
    });
    
    return Promise.all(syncPromises);
  } catch (error) {
    console.error('Error in syncContactForms:', error);
    throw error;
  }
}

// IndexedDB helper functions
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('jdm-heaven-offline', 1);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pending-forms')) {
        db.createObjectStore('pending-forms', { keyPath: 'id', autoIncrement: true });
      }
    };
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function getAllPendingForms(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('pending-forms', 'readonly');
    const store = transaction.objectStore('pending-forms');
    const request = store.getAll();
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function deleteForm(db, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('pending-forms', 'readwrite');
    const store = transaction.objectStore('pending-forms');
    const request = store.delete(id);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Push notification event
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  try {
    const data = event.data.json();
    
    const options = {
      body: data.body || 'New notification from JDM HEAVEN',
      icon: '/logo-icon.png',
      badge: '/logo-icon.png',
      data: {
        url: data.url || '/'
      }
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'JDM HEAVEN', options)
    );
  } catch (error) {
    console.error('Error showing notification:', error);
  }
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then((clientList) => {
        const url = event.notification.data.url || '/';
        
        // Check if there's already a window open
        for (const client of clientList) {
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        
        // If no window is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});