'use strict';

var BaseWebhook = require('nci-base-webhook').BaseWebhook,
	inherits = require('util').inherits;

var GitlabWebhook = function() {
	BaseWebhook.call(this, {name: 'gitlab'});
};

inherits(GitlabWebhook, BaseWebhook);

GitlabWebhook.prototype.check = function(req, project) {
	return req.headers['x-gitlab-event'] === 'Push Hook' &&
		req.body.ref === 'refs/heads/' + project.scm.rev;
};

exports.register = function(app) {
	var gitlabWebhook = new GitlabWebhook();

	gitlabWebhook.register(app);
};
