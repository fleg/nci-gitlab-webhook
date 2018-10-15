'use strict';

var expect = require('expect.js');
var sinon = require('sinon');
var rewire = require('rewire');

var lib = rewire('../../lib');

describe('lib.register with suitable params', function() {
	var revertMocks;

	var initialArgs = {
		app: 'nci app object'
	};

	var mocks = {
		GitlabWebhook: sinon.stub(),
		gitlabWebhookInstance: {
			register: sinon.stub()
		}
	};
	mocks.GitlabWebhook.prototype.register = mocks.gitlabWebhookInstance.register;

	before(function() {
		revertMocks = lib.__set__({
			GitlabWebhook: mocks.GitlabWebhook
		});
	});

	it('should return gitlab token', function() {
		var result = lib.register(initialArgs.app);
	});

	it('GitlabWebhook should be called 1 time', function() {
		expect(mocks.GitlabWebhook.callCount).equal(1);
	});

	it('GitlabWebhook should be called with new', function() {
		expect(mocks.GitlabWebhook.calledWithNew).ok();
	});

	it('GitlabWebhook should be called with certain params', function() {
		expect(mocks.GitlabWebhook.getCall(0).args).eql([]);
	});

	it('gitlabWebhook.register should be called 1 time', function() {
		expect(mocks.gitlabWebhookInstance.register.callCount).equal(1);
	});

	it('gitlabWebhook.register should be called with certain params', function() {
		expect(mocks.gitlabWebhookInstance.register.getCall(0).args).eql([
			initialArgs.app
		]);
	});

	after(function() {
		revertMocks();
	});
});
