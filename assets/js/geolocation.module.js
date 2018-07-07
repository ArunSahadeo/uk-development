import {EventBus} from './event-bus';

var geolocationModule = function () {

	var self = this;

	self.coordinates = {};

	self.init = function () {
		self.bindEvents();
	};

	self.requestLocation = function () {
		if (!navigator.geolocation) {
			self.setLocation({
				latitude: 51.505,
				longitude: -0.09
			});

			return;
		};

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
		EventBus.publish('coordinates-received', self.coordinates);
	};

	self.bindEvents = function () {
		EventBus.subscribe('request-location', self.requestLocation);
	};

	self.init();

};

window.addEventListener('load', geolocationModule); 
