(function () {

	'use strict';

	let ReadabilityCtrl = require('../controllers/readability.ctrl');

	function ReadabilityRoutes(app) {

		app.route('/readability/:url')
			.get(ReadabilityCtrl.getReadabilityData);

	}

	module.exports = ReadabilityRoutes;

})();