'use strict';

var expect = require('expect.js');
var rewire = require('rewire');
var sinon = require('sinon');

var lib = rewire('../../../lib');
var GitlabWebhook = lib.__get__('GitlabWebhook');

var describeTitle = 'GitlabWebhook.checkCommitSkipped with "[skip ci]"';
describe(describeTitle, function() {
	var initialArgs = {
		commit: {
			message: 'test message [skip ci]'
		}
	};

	it('should return truthy value', function() {
		var webhook = new GitlabWebhook();
		var result = webhook.checkCommitSkipped(initialArgs.commit);

		expect(result).ok();
	});
});
