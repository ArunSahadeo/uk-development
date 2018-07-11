import Config from './config';
import EventBus from './event-bus';

var companyLookupModule = function () {

	var self = this;

	self.GITHUB_API_ENDPOINT = 'https://api.github.com/graphql';
	self.GITHUB_FRONTEND = 'https://github.com';

	self.GITHUB_API_QUERY = {};

	self.init = function () {
		self.bindEvents();
	};

	self.buildGitHubAPIQuery = function (company) {
		let call = {};

		call['query'] = 'query($repo_limit:Int!) {';
		call['query'] += ('organization(login: "' + (company.short_name || company.long_name) + '") {'	 );
		call['query'] += 'repositories(last: $repo_limit) {';
		call['query'] += 'nodes {';
		call['query'] += 'name\n';
		call['query'] += 'isFork';
		call['query'] += '}';
		call['query'] += '}';
		call['query'] += '}';
		call['query'] += '}';

		call['variables'] = {};
		call['variables']['repo_limit'] = 20;

		return call;
	}

	self.checkOpenSourceCredentials = function (params) {

		if (localStorage.getItem('company-' + params.index + '-does-os')) {
			let isOS = localStorage.getItem('company-' + params.index + '-does-os');
			EventBus.publish('is-open-source', isOS);
			return;
		}

		self.GITHUB_API_QUERY = self.buildGitHubAPIQuery(params.company);

		let ajax = new XMLHttpRequest();

		ajax.onreadystatechange = function () {
			if (this.readyState === 4 && this.status === 200) {
				self.parseGitHubResponse(ajax.response);
			} else {
				console.error(this.responseText);
			}
		};

		ajax.open('POST', self.GITHUB_API_ENDPOINT);

		ajax.setRequestHeader('Content-Type', 'application/json');
		ajax.setRequestHeader('Authorization', 'bearer ' + Config.githubAPIToken);

		ajax.send(JSON.stringify(self.GITHUB_API_QUERY));
	};

	self.parseGitHubResponse = function (response) {
		let repos = JSON.parse(response);

		if (repos['errors']) {
			EventBus.publish('is-open-source', false);
			return;
		}

		repos = repos['data']['organization']['repositories']['nodes'] || {};

		if (!Object.keys(repos).length) {
			EventBus.publish('is-open-source', false);
			return;
		}

		repos = repos.filter(function (repo) {
			return repo['isFork'] === true;
		});

		if (repos.length > 0) {
			EventBus.publish('is-open-source', true);
		} else {
			EventBus.publish('is-open-source', false);
		}

	};

	self.bindEvents = function () {
		EventBus.subscribe('does-open-source', self.checkOpenSourceCredentials);
	};

	self.init();

};

window.addEventListener('load', companyLookupModule); 
