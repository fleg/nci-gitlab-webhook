'use strict';

var expect = require('expect.js');
var rewire = require('rewire');

var lib = rewire('../../../lib');
var GitlabWebhook = lib.__get__('GitlabWebhook');

var describeTitle = 'GitlabWebhook.check with open merge request ' +
	'webhook request in Work In Progress status';
describe(describeTitle, function() {
	var initialArgs = {
		req: {
			headers: {
				'x-gitlab-event': 'Merge Request Hook'
			},
			body: {
				object_attributes: {
					action: 'open',
					source_branch: 'test-branch',
					work_in_progress: true,
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
