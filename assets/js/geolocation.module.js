import EventBus from './event-bus';

var geolocationModule = function () {

	var self = this;

	self.coordinates = {};

	self.init = function () {
		self.bindEvents();
	};

	self.requestLocation = function (country) {
		if (!navigator.geolocation) {
			self.setLocation({
				latitude: 51.505,
				longitude: -0.09
			});

			return;
		};

		if (country !== 'United Kingdom') {
			self.setLocation({
				latitude: 51.505,
				longitude: -0.09
			});

			return;
		}

		if (localStorage.getItem('map-coordinates')) {
			let position = JSON.parse(localStorage.getItem('map-coordinates'));
			self.setLocation({
				latitude: position.latitude,
				longitude: position.longitude
			});
			return;
		}

		navigator.geolocation.getCurrentPosition(function (position) {
			self.setLocation({
				latitude: position.coords.latitude,
				longitude: position.coords.longitude
			});
		}, function (error) {
			if (error.code === error.PERMISSION_DENIED) {
				self.setLocation({
					latitude: 51.505,
					longitude: -0.09
				});
			} else if (error.code === error.POSITION_UNAVAILABLE) {
				alert('Your position doesn\'t seem to be available at the moment. Using fallback coordinates instead.');
				self.setLocation({
					latitude: 51.505,
					longitude: -0.09
				});
			} else {
				console.error(error);
			}
		});
	};

	/**
	 * Set location
	 */

	self.setLocation = function (value) {
		self.coordinates = value;

		if (!localStorage.getItem('map-coordinates')) {
			localStorage.setItem('map-coordinates', JSON.stringify(self.coordinates));
		}

		window.setTimeout(function () {
			EventBus.publish('coordinates-received', self.coordinates);
		}, 1);

	};

	self.bindEvents = function () {
		EventBus.subscribe('request-location', self.requestLocation);
	};

	self.init();

};

window.addEventListener('load', geolocationModule); 
