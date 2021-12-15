'use strict';

const chai = require('chai');
const assert = chai.assert;
var test = require('../../src/code/postGresFactory.src.js');

describe('PostGres', function() {

	//Constructor for PostGresClass initially sets 
	//username to value "none set" 
	describe('Constructor', function () {
		it('should set initial value of username to "None Set"', () => test.shouldBeNoneSet());
	});
	//PostGres.setName('User Name');
	describe('setName', function()  {
		it('should set value of username to "User Name"', () => test.shouldBeUserName());
	});
	//PostGres.getCookie(String) should parse the given string
	//and return a valid cookie string.
	describe('getCookie', function () {
		it('should return a valid cookie string', () =>  test.shouldBeValidCookie())
	});
});
