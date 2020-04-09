self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.addAll([
        '/offline/',
        '/offline/offline.js',
        '/offline/offline.css'
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request).catch(function(error) {
      var url = new URL (event.request.url);
      if (url.pathname == "/" || url.pathname == "/offline.js" || url.pathname == "/offline.css") {
        url.pathname = "/offline" + url.pathname;
        var request = new Request(url.href);
        var cached = caches.match(request);
        return cached;
      } else {
        return error;
      }
    })
  );
});
