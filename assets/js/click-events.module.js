import {EventBus} from './event-bus';

var clickEventsModule = function () {

	var self = this;

	self.init = function () {
		self.bindEvents();
	};

	self.closeModal = function (closeBtn) {
		var modal = closeBtn.parentElement.parentElement;

		if (modal.classList.contains('modal')) {
			modal.classList.add('hide');
		}

		if (document.body.classList.contains('overflow-hidden')) {
			document.body.classList.remove('overflow-hidden');
		}
	};


	self.bindEvents = function () {
		EventBus.subscribe('close-modal', self.closeModal);
	};

	self.init();

};

window.addEventListener('load', clickEventsModule); 
