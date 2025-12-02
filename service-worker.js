// service-worker.js
// TaskFlow Service Worker for PWA functionality

const CACHE_NAME = 'taskflow-v1.2';
const urlsToCache = [
  '/TaskFlow/',
  '/TaskFlow/index.html',
  '/TaskFlow/css/theme.css',
  '/TaskFlow/css/layout.css',
  '/TaskFlow/css/calendar.css',
  '/TaskFlow/css/categories.css',
  '/TaskFlow/css/items.css',
  '/TaskFlow/css/dates.css',
  '/TaskFlow/css/modals.css',
  '/TaskFlow/css/progress.css',
  '/TaskFlow/css/components.css',
  '/TaskFlow/js/storage.js',
  '/TaskFlow/js/categories.js',
  '/TaskFlow/js/items.js',
  '/TaskFlow/js/recurring.js',
  '/TaskFlow/js/calendar.js',
  '/TaskFlow/js/filters.js',
  '/TaskFlow/js/sorting.js',
  '/TaskFlow/js/shortcuts.js',
  '/TaskFlow/js/theme.js',
  '/TaskFlow/js/ical-export.js',
  '/TaskFlow/js/ui.js',
  '/TaskFlow/js/dialogs.js',
  '/TaskFlow/js/main.js',
  // Bootstrap CDN (for offline use)
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css'
];

// Install event - cache all files
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching files');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker: Installed successfully');
        return self.skipWaiting(); // Activate immediately
      })
      .catch(err => {
        console.error('Service Worker: Cache failed', err);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cache => {
            if (cache !== CACHE_NAME) {
              console.log('Service Worker: Clearing old cache', cache);
              return caches.delete(cache);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim(); // Take control immediately
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  // Skip chrome-extension and other non-http requests
  if (!event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          console.log('Service Worker: Serving from cache:', event.request.url);
          return response;
        }

        // Clone the request
        const fetchRequest = event.request.clone();

        // Network request
        return fetch(fetchRequest)
          .then(response => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            // Cache the new response for future use
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
                console.log('Service Worker: Cached new resource:', event.request.url);
              });

            return response;
          })
          .catch(err => {
            console.error('Service Worker: Fetch failed', err);
            // Could return a custom offline page here
            return new Response('Offline - Please check your connection', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

// Background sync event (for future features)
self.addEventListener('sync', event => {
  console.log('Service Worker: Background sync triggered', event.tag);
  
  if (event.tag === 'sync-tasks') {
    event.waitUntil(
      // This will be used later for backend sync
      syncTasks()
    );
  }
});

// Placeholder for future sync functionality
function syncTasks() {
  console.log('Service Worker: Syncing tasks...');
  // Future: Sync localStorage with backend
  return Promise.resolve();
}

// Push notification event (for future alarm notifications)
self.addEventListener('push', event => {
  console.log('Service Worker: Push notification received', event);
  
  const options = {
    body: event.data ? event.data.text() : 'New notification from TaskFlow',
    icon: '/TaskFlow/icons/icon-192x192.png',
    badge: '/TaskFlow/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    tag: 'taskflow-notification',
    requireInteraction: true,
    actions: [
      { action: 'open', title: 'Open TaskFlow' },
      { action: 'close', title: 'Dismiss' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('TaskFlow', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', event => {
  console.log('Service Worker: Notification clicked', event.action);
  
  event.notification.close();

  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/TaskFlow/')
    );
  }
});

// Message event (for communication with main app)
self.addEventListener('message', event => {
  console.log('Service Worker: Message received', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_CLEAR') {
    event.waitUntil(
      caches.delete(CACHE_NAME)
        .then(() => {
          console.log('Service Worker: Cache cleared');
          event.ports[0].postMessage({ success: true });
        })
    );
  }
});

console.log('Service Worker: Loaded and ready');