'use strict';

var express   = require('express');
var router    = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
	return res.render('index', { view: { dashboard: 0 } });
});

router.get('/dashboard', function (req, res, next) {
	return res.render('dashboard', { view: { dashboard: 1 } });
});

module.exports = router;
