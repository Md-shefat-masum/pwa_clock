// service-worker.js

// Install event
self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open('your-app-cache').then(function (cache) {
            return cache.addAll([
                // Add paths to your static assets (HTML, CSS, JS, images, etc.)
                './index.html',
                './styles.css',
                './main.js',
                './service-worker.js',
                './watchworker.js',
                // Add more paths as needed
            ]);
        })
    );
});

// Fetch event
self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request).then(function (response) {
            return response || fetch(event.request);
        })
    );
});

self.addEventListener('push', function (event) {
    const options = {
        badge: 'https://shefat.info/assets/icons/icon-512x512.png',
        data: {
            badgeCount: 334
            // Update the badge count from the incoming notification data
        }
    };

    event.waitUntil(
        self.registration.showNotification('New Notification', options)
    );
    self.registration.showNotification("Hello from the Service Worker!");
});
