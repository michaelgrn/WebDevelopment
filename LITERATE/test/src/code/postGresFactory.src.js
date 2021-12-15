'use strcit';
const chai = require('chai');
const assert = chai.assert;
var PostGresClass = require('../../../literate-app/js/postgres.factory.js');


module.exports = {
	
	shouldBeNoneSet: function(){
		var PostGres = new PostGresClass();
		var user = PostGres.getName();
		return assert.equal(user, 'None Set');
	},

	shouldBeUserName: function(){
		var PostGres = new PostGresClass();
		PostGres.setName('User Name');
		var user = PostGres.getName();
		return assert.equal(user, 'User Name');
	},

	shouldBeValidCookie: function(){
		var PostGres = new PostGresClass();
		var cookie = PostGres.getCookie("YummyCookie");
		return assert.equal(cookie, "");
	}

}
	
