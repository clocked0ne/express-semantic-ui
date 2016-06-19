'use strict';

var config = {
	protocol: 'http',
	siteURL: 'localhost',
	port: process.env.PORT || 5000,
	requestLogging: false,
	session: {
		secret: 'defaultSecret',
		name: 'session'
	},
	cloudFrontS3: {
		key: '<youraccesskeyhere>',
		secret: '<yoursecretaccesskeyhere>',
		bucket: 'bucket-name',
		region: 'eu-west-1',
		distributionId: '<cloudfrontsubdomain>'
	},
	gulpBuildMaps: false,
	frontend: {
		useCDN: false,
		staticFilesURI: '<xxxxxxxxxxxxxx.cloudfront.net>',
		staticFilesPath: '/static'
	}
};

module.exports = config;
