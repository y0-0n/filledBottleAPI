const router = require('express').Router();
const passport = require('passport');
const axios = require('axios');
const auth = require("../api/auth/auth");
const CryptoJs = require("crypto-js");

function makeSignature(secretKey, method, baseString, timestamp, accessKey) {
	const space = ' ';
	const newLine = '\n';
	let hmac = CryptoJs.algo.HMAC.create(CryptoJs.algo.SHA256, secretKey);

	hmac.update(method);
	hmac.update(space);
	hmac.update(baseString);
	hmac.update(newLine);
	hmac.update(timestamp);
	hmac.update(newLine);
	hmac.update(accessKey);
	const hash = hmac.finalize();

	return hash.toString(CryptoJs.enc.Base64);
}

router.get('/',
  passport.authenticate('JWT', { session: false }),
  auth.checkAuthed,
  (req, res) => {
		const ACCESS_KEY = 'jrGFECFhWE8RiuQng3io';
		const SECRET_KEY = 'Trirffs7sGps9toOIieqI1TVMhyAk2IetGA4hVoW';
		const requestUrl = `/geolocation/v2/geoLocation?ip=${req.query.ip}&responseFormatType=json&ext=t`
		const hostName = 'https://geolocation.apigw.ntruss.com'
		const timestamp = + new Date() + '';
		const SIGNATURE = makeSignature(SECRET_KEY, 'GET', requestUrl, timestamp, ACCESS_KEY);

		const config = {
			headers: {
				'x-ncp-apigw-timestamp' : timestamp,
				'x-ncp-iam-access-key': ACCESS_KEY,
				'x-ncp-apigw-signature-v2': SIGNATURE
			}
		}
		
		/*let request = require('request');
		request.get(options, function (error, response, body) {
			if(!error && response.statusCode === 200) {
				res.json(JSON.parse(body))
			} else {
				res.status(response.statusCode).end();
				console.warn('error = ' + response.statusCode)
			}
		})*/
		axios.get(`${hostName}${requestUrl}`, config)
			.then(response => { res.json((response.data)) })
			//.catch(error => { console.warn(error.response.data); })
	}
);

module.exports = router;