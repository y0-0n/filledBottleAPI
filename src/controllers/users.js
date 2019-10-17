const express = require('express');
const Users = require('../models/Users');
const router = express.Router();

/**
 * GET /users/signup
 * 개인 회원가입
 */
router.post('/users/signup', (req, res) => {
	data = req.body
	Users.addUser(data, (err, result) => {
		if(err) throw err;

		console.log(result);
	});

	res.header("Access-Control-Allow-Origin", "*");
	res.send("Success");
});

router.options('/users/signup', (req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
	next();
});

module.exports = router;
