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

	self.layers = {};

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

		self.layers.grayscale = L.tileLayer('https://maps.omniscale.net/v2/demo/style.grayscale/{z}/{x}/{y}.png', {
			minZoom: 3,
			maxZoom: 19
		});
		
		self.layers.streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			minZoom: 3,
			maxZoom: 19
		});

		var map = L.map('map', {
			layers: [self.layers.grayscale, self.layers.streets]
		});
			
		map.setView([self.coordinates.latitude, self.coordinates.longitude], 13);

			

		var currentPositionMarker = L.marker([self.coordinates.latitude, self.coordinates.longitude], {
			title: 'This is your current location'
		});

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
			let companyMarker = L.marker([company.coordinates[0], company.coordinates[1]], {
				title: company.name
			});

			Array.from(company.content).forEach(function (line, index) {
				company.content[index] = '<p>' + line + '</p>';
			});

			let popupHTML = company.content.join('');

			companyMarker.bindPopup(popupHTML);

			if (Regions['East of England'].indexOf(company.county) > -1) {
				eastEnglandFirms.addLayer(companyMarker);
			}
		});
		
		const
			grayscale = L.tileLayer('https://maps.omniscale.net/v2/demo/style.grayscale/{z}/{x}/{y}.png'),
			streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
		;

		const baseLayers = {
			"Grayscale": grayscale,
			"Streets": streets
		};

		const mapRegions = {
			"East of England": eastEnglandFirms
		};

		L.control.layers(baseLayers, mapRegions).addTo(map);

		eastEnglandFirms.addTo(map);
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
