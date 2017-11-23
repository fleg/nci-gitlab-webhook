'use strict';

var BaseWebhook = require('nci-base-webhook').BaseWebhook,
	inherits = require('util').inherits;

var GitlabWebhook = function() {
	BaseWebhook.call(this, {name: 'gitlab'});
};

inherits(GitlabWebhook, BaseWebhook);

GitlabWebhook.prototype.getSecret = function(req) {
	return (
		req.headers['x-gitlab-token'] ||
		BaseWebhook.prototype.getSecret.call(this, req)
	);
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
				(
					req.body.object_attributes.action === 'open' ||
					req.body.object_attributes.action === 'update'
				) &&
				req.body.object_attributes.source_branch
			)
		)
	);
};

GitlabWebhook.prototype.createBuild = function(req, project, app) {
	var params = {
		projectName: project.name,
		withScmChangesOnly: false,
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
	}

	app.builds.create(params);
};

exports.register = function(app) {
	var gitlabWebhook = new GitlabWebhook();

	gitlabWebhook.register(app);
};
