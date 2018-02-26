const cacheVerison = "0.0.1";

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(cacheVerison).then(cache => {
      return cache.addAll([
        "./",
        "./index.html",
        "./dist/index.js",
        "./dist/index.css"
      ]);
    })
  );

  event.waitUntil(self.skipWaiting());
});

if (location.hostname !== "localhost") {
  self.addEventListener("fetch", event => {
    event.respondWith(
      caches.match(event.request).then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        } else {
          // Miss - fetch over network
          return fetch(event.request);
        }
      })
    );
  });
}

self.addEventListener("activate", event => {
  const cacheWhitelist = [cacheVerison];

  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (cacheWhitelist.indexOf(key) === -1) {
            return caches.delete(key);
          }
        })
      );
    })
  );

  event.waitUntil(self.clients.claim());
});
