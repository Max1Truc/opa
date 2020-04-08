self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).then((result) => {
      return result || new Response("<h1>Vous êtes hors-ligne...</h1>", {
        headers: {
          'Content-Type': 'text/html'
        }
      });
    })
  );
});
