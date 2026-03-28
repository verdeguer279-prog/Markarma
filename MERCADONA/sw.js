const CACHE_NAME = 'lista-compra-mercadona-v6';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './logo192.png',
  './logo512.png'
];

// Instalación del Service Worker y guardado en Caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Archivos cacheados exitosamente');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
  self.skipWaiting();
});

// Activación y limpieza de cachés antiguas
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Estrategia Cache-First para los archivos estáticos
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Devuelve la versión en caché si existe, si no, va a la red
        return response || fetch(event.request);
      })
  );
});