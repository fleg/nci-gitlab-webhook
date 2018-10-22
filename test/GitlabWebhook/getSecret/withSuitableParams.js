'use strict';

var expect = require('expect.js');
var rewire = require('rewire');
var sinon = require('sinon');

var lib = rewire('../../../lib');
var GitlabWebhook = lib.__get__('GitlabWebhook');

var describeTitle = 'GitlabWebhook.getSecret with suitable params';
describe(describeTitle, function() {
	var initialArgs = {
		req: {
			headers: {
				'x-gitlab-token': 'secret'
			}
		}
	};

	it('should return gitlab token', function() {
		var webhook = new GitlabWebhook();
		var result = webhook.getSecret(initialArgs.req);

		expect(result).eql(initialArgs.req.headers['x-gitlab-token']);
	});
});
