var CACHE_NAME = "static-cache";
var urlsToCache = [
  ".",
  "index.html",
  "style.css",
  "main.js",
  "favicon.svg",
  "fonts/IBMPlexSans-Medium.ttf",
  "fonts/IBMPlexSans-Regular.ttf",
  "fonts/IBMPlexSerif-Bold.ttf",
  "icons/favicon-16x16.png",
  "icons/favicon-32x32.png",
  "icons/favicon.ico",
  "icons/mstile-150x150.png",
  "icons/highlight_off-white-18dp.svg",
  "icons/safari-pinned-tab.svg",
  "icons/settings_backup_restore-white-18dp.svg",
  "icons/check_circle-white-18dp.svg",
  "icons/check_circle_outline-white-18dp.svg",
  "icons/clear-white-18dp.svg",
  "icons/delete_forever-white-18dp.svg",
  "icons/done-white-18dp.svg",
  "icons/done-dark-18dp.svg"
];
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetchAndCache(event.request);
    })
  );
});

function fetchAndCache(url) {
  return fetch(url)
    .then(function (response) {
      // Check if we received a valid response
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return caches.open(CACHE_NAME).then(function (cache) {
        cache.put(url, response.clone());
        return response;
      });
    })
    .catch(function (error) {
      console.log("Request failed:", error);
      // You could return a custom offline 404 page here
    });
}
