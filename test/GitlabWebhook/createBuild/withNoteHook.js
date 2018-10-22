'use strict';

var expect = require('expect.js');
var rewire = require('rewire');
var sinon = require('sinon');

var lib = rewire('../../../lib');
var GitlabWebhook = lib.__get__('GitlabWebhook');

var describeTitle = 'GitlabWebhook.createBuild with note webhook';
describe(describeTitle, function() {
	var initialArgs = {
		req: {
			headers: {
				'x-gitlab-event': 'Note Hook'
			},
			body: {
				merge_request: {
					id: 1,
					iid: 1,
					source_project_id: 1,
					target_project_id: 2,
					source_branch: 'test-branch'
				}
			}
		},
		project: {
			name: 'test-project'
		},
		app: {
			builds: {
				create: sinon.stub()
			}
		}
	};

	it('should be ok', function() {
		var webhook = new GitlabWebhook();
		webhook.createBuild(
			initialArgs.req, initialArgs.project, initialArgs.app
		);
	});

	it('initialArgs.app.builds.create should be called 1 time', function() {
		var mock = initialArgs.app.builds.create;

		expect(mock.callCount).equal(1);
	});

	it(
		'initialArgs.app.builds.create should be called with certain params',
		function() {
			var mock = initialArgs.app.builds.create;

			expect(mock.getCall(0).args).eql([{
				projectName: initialArgs.project.name,
				withScmChangesOnly: false,
				queueQueued: true,
				initiator: {
					type: 'gitlab-webhook',
					mergeRequest: {
						id: initialArgs.req.body.merge_request.id,
						iid: initialArgs.req.body.merge_request.iid,
						sourceProjectId: initialArgs.req.body.merge_request
							.source_project_id,
						targetProjectId: initialArgs.req.body.merge_request
							.target_project_id
					}
				},
				buildParams: {
					scmRev: initialArgs.req.body.merge_request.source_branch
				}
			}]);
		}
	);
});
