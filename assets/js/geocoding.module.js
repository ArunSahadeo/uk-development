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

		if (remoteIP === '127.0.0.1') {
			sessionStorage.setItem('country', host === 'localhost' ? 'United Kingdom' : 'United States');
		}

		if (sessionStorage.getItem('country')) {
			console.log('Country already set!');
			self.foreignModal(sessionStorage.getItem('country'));
			return;
		}

		self.callAPI(remoteIP);
	};

	self.callAPI = function (remoteIP) {
		let 
			ajax = new XMLHttpRequest(),
			alnumPattern = /^[0-9a-zA-Z]+$/,
			queryParams = String(remoteIP + '?access_key=' + Config.IPStackAPIKey)
		;

		if (!Config.IPStackAPIKey.match(alnumPattern)) {
			return;
		}

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
			EventBus.publish('request-location', country);
			return;
		}

		const foreignModal = document.querySelector('div#foreign-modal');
		foreignModal.classList.remove('hide');

		document.body.classList.add('overflow-hidden');

		EventBus.publish('request-location', country);
	};

	self.bindEvents = function () {
		EventBus.subscribe('check-coordinates', self.checkCoordinates);
	};

	self.init();

};

window.addEventListener('load', geocodingModule); 
