'use strict';

var expect = require('expect.js');
var rewire = require('rewire');

var lib = rewire('../../../lib');
var GitlabWebhook = lib.__get__('GitlabWebhook');

var describeTitle = 'GitlabWebhook.check with update merge request and ' +
	'without source branch';
describe(describeTitle, function() {
	var initialArgs = {
		req: {
			headers: {
				'x-gitlab-event': 'Merge Request Hook'
			},
			body: {
				object_attributes: {
					action: 'update',
					work_in_progress: false,
					oldrev: 'test-commit-sha',
					last_commit: {
						message: 'test commit message'
					}
				}
			}
		},
		project: {}
	};

	it('should return falsy value', function() {
		var webhook = new GitlabWebhook();
		var result = webhook.check(initialArgs.req, initialArgs.project);

		expect(result).not.ok();
	});
});
