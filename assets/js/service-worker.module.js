import EventBus from './event-bus';

var serviceWorkerModule = function () {

	var self = this;

	self.init = function () {
		self.bindEvents();
	};

	self.registerServiceWorker = function () {
		navigator.serviceWorker.register('/dist/service-worker.js')
			.then(function (registration) {

				if (registration.installing) {
					console.log('Service worker installing');
				} else if (registration.waiting) {
					console.log('Service worker installed');
				} else if (registration.active) {
					console.log('Service worker active');
				}

			}).catch(function (err) {
				console.log('Registration failed with ' + err);
			});
	};

	self.bindEvents = function () {
		EventBus.subscribe('register-service-worker', self.registerServiceWorker);
	};

	self.init();

};

window.addEventListener('load', serviceWorkerModule); 
