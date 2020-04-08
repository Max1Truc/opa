self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).then((result) => {
      return result;
    })
  );
});
