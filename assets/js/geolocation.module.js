import {EventBus} from './event-bus';

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
			}
		});
	};

	/**
	 * Set location
	 */

	self.setLocation = function (value) {
		self.coordinates = value;

		if (remoteIP === '127.0.0.1' && host !== 'localhost') {
			window.setTimeout(function () {
				EventBus.publish('coordinates-received', self.coordinates);
			}, 10);
		}

		EventBus.publish('coordinates-received', self.coordinates);
	};

	self.bindEvents = function () {
		EventBus.subscribe('request-location', self.requestLocation);
	};

	self.init();

};

window.addEventListener('load', geolocationModule); 
