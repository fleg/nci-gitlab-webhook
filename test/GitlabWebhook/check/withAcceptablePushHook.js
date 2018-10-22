'use strict';

var expect = require('expect.js');
var rewire = require('rewire');

var lib = rewire('../../../lib');
var GitlabWebhook = lib.__get__('GitlabWebhook');

var describeTitle = 'GitlabWebhook.check with acceptable push webhook request';
describe(describeTitle, function() {
	var initialArgs = {
		req: {
			headers: {
				'x-gitlab-event': 'Push Hook'
			},
			body: {
				ref: 'refs/heads/test-branch',
				commits: [{
					message: 'test commit message'
				}]
			}
		},
		project: {
			scm: {
				rev: 'test-branch'
			}
		}
	};

	it('should return truthy value', function() {
		var webhook = new GitlabWebhook();
		var result = webhook.check(initialArgs.req, initialArgs.project);

		expect(result).ok();
	});
});
