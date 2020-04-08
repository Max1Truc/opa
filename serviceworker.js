self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).then((result) => result || new Response("<h1>Vous êtes hors-ligne</h1>");
  );
});
