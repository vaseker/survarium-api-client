'use strict';

var path    = require('path');
var express = require('express');
var router  = express.Router();

router.use('/public', express.static(path.join(__dirname, '..', 'static'), {
	dotfiles: 'deny',
	redirect: true
}));

router.use(require('morgan')(':remote-addr :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] - :response-time ms ":referrer" ":user-agent"'));

router.get('/', function (req, res) {
	return res.redirect('/public');

	res.json({
		api: req.protocol +
		'://' +
		req.hostname +
		'/v1'
	});
});

router.use('/v1', require('./v1/router'));

router.use(require('./middleware/errors'));

module.exports = router;
