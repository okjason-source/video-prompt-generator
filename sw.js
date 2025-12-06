// Service Worker for Video Prompt Generator PWA
const CACHE_NAME = 'video-prompt-generator-v11';
const urlsToCache = [
  '/video-prompt-generator.html',
  '/styles.css',
  '/script.js',
  '/billionaire-mode.js',
  '/trailer-mode.js',
  '/tv-show-runner.js',
  '/ai-commercials.js',
  '/okjason-vlog.js',
  '/abstract-art-mode.js',
  '/viral-mode.js',
  '/product-mode.js',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

