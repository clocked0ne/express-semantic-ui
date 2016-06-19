'use strict';

var fs = require('fs');
var expect = require('chai').expect;
var config = {};
if(fs.existsSync('./config/config.js'))
	config = require('../../config/config');

describe('config', function configTest (){
	it('should exist', function configProperties (done){
		expect(config).to.not.be.empty;
		done();
	});

	it('should have the correct properties', function configProperties (done){
		expect(config).to.have.a.property('protocol').that.is.a('string');
		expect(config).to.have.a.property('siteURL').that.is.a('string');
		expect(config).to.have.a.property('port').that.is.a('number');
		expect(config).to.have.a.property('requestLogging').that.is.a('boolean');

		expect(config).to.have.a.property('session').that.is.an('object');
		expect(config.session).to.have.a.property('secret').that.is.a('string');
		expect(config.session).to.have.a.property('name').that.is.a('string');

		expect(config).to.have.a.property('cloudFrontS3').that.is.an('object');
		expect(config.cloudFrontS3).to.have.a.property('key').that.is.a('string');
		expect(config.cloudFrontS3).to.have.a.property('secret').that.is.a('string');
		expect(config.cloudFrontS3).to.have.a.property('bucket').that.is.a('string');
		expect(config.cloudFrontS3).to.have.a.property('region').that.is.a('string');
		expect(config.cloudFrontS3).to.have.a.property('distributionId').that.is.a('string');

		expect(config).to.have.a.property('gulpBuildMaps').that.is.a('boolean');

		expect(config).to.have.a.property('frontend').that.is.an('object');
		expect(config.frontend).to.have.a.property('useCDN').that.is.a('boolean');
		expect(config.frontend).to.have.a.property('staticFilesURI').that.is.a('string');
		expect(config.frontend).to.have.a.property('staticFilesPath').that.is.a('string');
		done();
	});
});
