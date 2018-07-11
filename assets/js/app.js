import EventBus from './event-bus';
import data from './data.json';
import Regions from './regions';

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
			if (localStorage.getItem('map-coordinates')) {
				coordinates = JSON.parse(localStorage.getItem('map-coordinates'));
			}
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

		var redMarkerIcon = L.icon({
			iconUrl: '/dist/red-marker.png',

			iconSize: [25, 41]
		});

		var currentPositionMarker = L.marker([self.coordinates.latitude, self.coordinates.longitude], {
			icon: redMarkerIcon,
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

		let eastEnglandFirms = L.layerGroup(),
			greaterLondonFirms = L.layerGroup(),
			openSourceFirms = L.layerGroup();
		
		Array.from(data).forEach(function (company, index) {

			let companyMarker = L.marker([company.coordinates[0], company.coordinates[1]], {
				title: company.long_name || company.short_name
			});

			let popupHTML = '<h2>About ' + (company.long_name || company.short_name) + '</h2>';

			Array.from(company.content).forEach(function (line, index) {
				company.content[index] = '<p>' + line + '</p>';
			});

			popupHTML += company.content.join('');

			companyMarker.bindPopup(popupHTML);

			EventBus.publish('does-open-source', {company, index});

			EventBus.subscribe('is-open-source', function(doesOS) {
				company.open_source = doesOS ? true : false;

				let companyItemName = String('company-' + index + '-does-os');
				if (!localStorage.getItem(companyItemName)) {
					localStorage.setItem(companyItemName, doesOS ? true : false);
				}
			});

			let isOpenSource = localStorage.getItem('company-' + index + '-does-os');
				
			if (company.open_source || isOpenSource) {
				openSourceFirms.addLayer(companyMarker);
				console.log(openSourceFirms);
			}

			switch(true) {
				case Regions['East of England'].indexOf(company.county) > -1:
					eastEnglandFirms.addLayer(companyMarker);
				break;

				case Regions['Greater London'].indexOf(company.county) > -1:
					greaterLondonFirms.addLayer(companyMarker);
				break;
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
			"East of England": eastEnglandFirms,
			"Greater London": greaterLondonFirms,
			"Open source": openSourceFirms
		};

		L.control.layers(baseLayers, mapRegions).addTo(map);

		eastEnglandFirms.addTo(map);
		greaterLondonFirms.addTo(map);
		openSourceFirms.addTo(map);

		map.on('load', self.mapLoaded());

	};

	self.mapLoaded = function () {
		sessionStorage.setItem('map-loaded', true);
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
