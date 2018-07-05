var leafletMapsModule = function () {

	var self = this;

	self.init = function () {
		self.bindEvents();
	};

	self.isMapLoaded = function (isLoaded) {
		if (!isLoaded) {
			console.error('Not all map tiles are loaded');
		} else {
			console.log('All map tiles loaded');
		}
	};

	self.bindEvents = function () {
		EventBus.subscribe('check-map-loaded', self.isMapLoaded);
	};

};
