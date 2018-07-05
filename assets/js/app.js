window.addEventListener('load', loadApp);

function loadApp() {
	let app = new App();
	app.init();
}

var App = function() {
	var self = this;

	self.init = function() {
		self.initMap();
	}

	self.initMap = function() {
		var map = L.map('map').setView([51.505, -0.09], 13),
			tile = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');

		tile.addTo(map);

		tile.on('load', function () {
			self.isMapLoaded(true);
		});

	}

	self.isMapLoaded = function(isLoaded) {
		EventBus.publish('check-map-loaded', isLoaded);
	}
}
