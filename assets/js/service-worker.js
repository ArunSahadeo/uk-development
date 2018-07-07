const
	cacheName = 'v1',
	offlinePage = '/dist/offline.html'
;

self.addEventListener('install', function (event) {
	console.log('Service worker installed!');
	event.waitUntil(
		fetch(offlinePage)
			.then(function (response) {
				return caches.open(cacheName)
					.then(function (cache) {
						return cache.put(offlinePage, response);
					});
			})
	)
});

self.addEventListener('fetch', function (event) {
	event.respondWith(
		fetch(event.request).catch(error => {
			return caches.match(offlinePage);
		})
	);
});
