'use strict';

var utils = require('../lib/utils');
var should = require('should');

describe('utils - emailRegex', function (){
    it('return false for not matching an RFC 5322 string', function (done){
        var emailBad = 'test\'test.com';
        should.equal(utils.emailRegex.test(emailBad), false);
		done();
    } );
    it('return true for matching an RFC 5322 string', function (done){
        var emailGood = 'test@test.com';
        should.equal(utils.emailRegex.test(emailGood), true);
		done();
    });
});

describe('utils - stringToNumber', function (){
	it('return NaN for string `£25,000`', function (done){
		var string = '£25,000';
		should.equal(isNaN(utils.stringToNumber(string)), isNaN(string));
		done();
	});
	it('return a Number for string `25000`', function (done){
		var string = '25000';
		should.equal(utils.stringToNumber(string), 25000);
		done();
	});
});
