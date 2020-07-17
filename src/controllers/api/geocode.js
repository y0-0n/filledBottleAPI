const router = require('express').Router();
const passport = require('passport');
const auth = require("../api/auth/auth");

router.get('/',
  (req, res) => {
		const CLIENT_ID = 'u8482r04pp';
		const CLIENT_SECRET = 'dCM0upCu5ZoYVKjinbLMgaF98o9vgOhOiM9dsAbX';
		const api_url = `https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=${encodeURI(req.query.query)}`
		let request = require('request');
		var options = {
			url: api_url,
			headers: {'X-NCP-APIGW-API-KEY-ID' : CLIENT_ID, 'X-NCP-APIGW-API-KEY': CLIENT_SECRET}
		};
		request.get(options, function (error, response, body) {
			if(!error && response.statusCode === 200) {
				res.json(JSON.parse(body))
			} else {
				res.status(response.statusCode).end();
				console.warn('error = ' + response.statusCode)
			}
		})
	}
);



module.exports = router;