self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('pwa-cache').then((cache) => {
		return caches.addAll([
			'/',
			'./index.html',
			'./style.css',
			'./app.js',
			'./manifest.json'
		]);
	})
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((resp) => {
		return resp || fetch(e.request);
	})
  );
});