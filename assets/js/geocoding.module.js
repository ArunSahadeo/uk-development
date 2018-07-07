import {Config} from './config';
import {EventBus} from './event-bus';

var geocodingModule = function () {

	var self = this;

	self.API_URL = 'http://api.ipstack.com/';

	self.init = function () {
		self.bindEvents();
	};

	/**
	 * Checks coordinates
	*/

	self.checkCoordinates = function (remoteIP) {
		if (sessionStorage.getItem('country')) {
			console.log('Country already set!');
			return;
		}

		self.callAPI(remoteIP);
	};

	self.callAPI = function (remoteIP) {
		let 
			ajax = new XMLHttpRequest(),
			queryParams = String(remoteIP + '?access_key=' + Config.IPStackAPIKey)
		;

		ajax.onreadystatechange = function () {
			if (this.readyState === 4 && this.status === 200) {
				self.parseResults(ajax.response);
			}
		};

		ajax.open('GET', self.API_URL + queryParams);
		ajax.send(null);
	};

	self.parseResults = function (response) {

		let result = JSON.parse(response);

		if (result.country_name) {
			sessionStorage.setItem('country', result.country_name);
			self.foreignModal(result.country_name);
		}
	}

	self.foreignModal = function (country) {
		if (country === 'United Kingdom') {
			return;
		}

		const foreignModal = document.querySelector('div#foreign-modal');
		foreignModal.classList.remove('hide');
	};

	self.bindEvents = function () {
		EventBus.subscribe('check-coordinates', self.checkCoordinates);
	};

	self.init();

};

window.addEventListener('load', geocodingModule); 