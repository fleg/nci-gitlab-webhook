'use strict';

var BaseWebhook = require('nci-base-webhook').BaseWebhook,
	inherits = require('util').inherits;

var GitlabWebhook = function() {
	BaseWebhook.call(this, {name: 'gitlab'});
};

inherits(GitlabWebhook, BaseWebhook);

GitlabWebhook.prototype.runCiRegExp = /^\s*\/run_ci\s*$/;

GitlabWebhook.prototype.getSecret = function(req) {
	return req.headers['x-gitlab-token'];
};

GitlabWebhook.prototype.check = function(req, project) {
	var events = project.webhooks[this.name].events || ['Push Hook'];

	var event = req.headers['x-gitlab-event'];

	return (
		(events.indexOf(event) !== -1) &&
		(
			(
				event === 'Push Hook' &&
				req.body.ref === 'refs/heads/' + project.scm.rev
			) ||
			(
				event === 'Merge Request Hook' &&
				req.body.object_attributes &&
				req.body.object_attributes.action === 'open' &&
				req.body.object_attributes.source_branch
			) ||
			(
				// check that mr has new commits
				event === 'Merge Request Hook' &&
				req.body.object_attributes &&
				req.body.object_attributes.action === 'update' &&
				req.body.object_attributes.source_branch &&
				req.body.object_attributes.oldrev
			) ||
			(
				event === 'Note Hook' &&
				req.body.object_attributes &&
				req.body.object_attributes.noteable_type === 'MergeRequest' &&
				req.body.merge_request &&
				req.body.merge_request.source_branch &&
				this.runCiRegExp.test(req.body.object_attributes.note)
			)
		)
	);
};

GitlabWebhook.prototype.createBuild = function(req, project, app) {
	var params = {
		projectName: project.name,
		withScmChangesOnly: false,
		queueQueued: true,
		initiator: {type: this.name + '-webhook'}
	};

	var event = req.headers['x-gitlab-event'];

	if (event === 'Merge Request Hook') {
		params.initiator.mergeRequest = {
			id: req.body.object_attributes.id,
			iid: req.body.object_attributes.iid,
			sourceProjectId: req.body.object_attributes.source_project_id,
			targetProjectId: req.body.object_attributes.target_project_id
		};

		params.buildParams = {
			scmRev: req.body.object_attributes.source_branch
		};
	} else if (event === 'Note Hook') {
		params.initiator.mergeRequest = {
			id: req.body.merge_request.id,
			iid: req.body.merge_request.iid,
			sourceProjectId: req.body.merge_request.source_project_id,
			targetProjectId: req.body.merge_request.target_project_id
		};

		params.buildParams = {
			scmRev: req.body.merge_request.source_branch
		};
	}

	app.builds.create(params);
};

exports.register = function(app) {
	var gitlabWebhook = new GitlabWebhook();

	gitlabWebhook.register(app);
};
