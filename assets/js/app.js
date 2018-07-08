import {EventBus} from './event-bus';
import data from './data.json';
import {Regions} from './regions';

window.addEventListener('load', loadApp);

function loadApp() {
	let app = new App();
	app.init();
}

var App = function () {
	var self = this;

	self.coordinates = {};

	self.init = function () {
		self.createEvents();
		self.initMap();
		self.offlineCache();
	}

	self.createEvents = function () {
		var modalCloseBtn = document.querySelector('.modal-close');
		modalCloseBtn.addEventListener('click', function () {
			EventBus.publish('close-modal', modalCloseBtn);
		});
	}

	self.getVisitorLocation = function () {
		EventBus.publish('check-coordinates', remoteIP);
	}

	self.initMap = function () {

		if (!document.getElementById('map')) {
			return;
		}

		self.getVisitorLocation();

		EventBus.subscribe('coordinates-received', function(coordinates) {
			self.coordinates = coordinates;
			self.loadMap();
		});

	};

	self.loadMap = function () {
			var map = L.map('map').setView([self.coordinates.latitude, self.coordinates.longitude], 13);

			var currentPositionMarker = L.marker([self.coordinates.latitude, self.coordinates.longitude]);

			var tile = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');

			currentPositionMarker.addTo(map);

			tile.addTo(map);

			tile.on('load', function () {
				self.isMapLoaded(true);
			});

			self.addCompanyMarkers(map);
	};

	self.addCompanyMarkers = function (map) {

		let eastEnglandFirms = L.layerGroup();
		
		Array.from(data).forEach(function (company, index) {
			let companyMarker = L.marker([company.coordinates[0], company.coordinates[1]]);

			let popupHTML = companyMarker.bindPopup(company.content.join('<br />'));

			companyMarker.bindPopup(popupHTML);

			if (Regions['East of England'].indexOf(company.county) > -1) {
				eastEnglandFirms.addLayer(companyMarker);
			}
		});

		eastEnglandFirms.addTo(map);

		console.log(eastEnglandFirms);
	};

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
