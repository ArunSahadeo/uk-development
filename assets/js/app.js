import {EventBus} from './event-bus';

window.addEventListener('load', loadApp);

function loadApp() {
	let app = new App();
	app.init();
}

var App = function () {
	var self = this;

	self.coordinates = {};

	self.init = function () {
		self.initMap();
		self.offlineCache();
	}

	self.initMap = function () {

		if (!document.getElementById('map')) {
			return;
		}

		EventBus.publish('request-location');
		EventBus.subscribe('coordinates-received', function(coordinates) {
			self.coordinates = coordinates;
			loadMap();
		});

		function loadMap () {
			var map = L.map('map').setView([self.coordinates.latitude, self.coordinates.longitude], 13),
				tile = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');

			tile.addTo(map);

			tile.on('load', function () {
				self.isMapLoaded(true);
			});
		}


	}

	self.offlineCache = function () {
		if (!navigator.serviceWorker) {
			return;
		}

		EventBus.publish('register-service-worker');
	}

	self.isMapLoaded = function (isLoaded) {
		EventBus.publish('check-map-loaded', isLoaded);
	}
}
