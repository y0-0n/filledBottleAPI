const router = require('express').Router();
const passport = require('passport');
const request = require('request');
const auth = require("../api/auth/auth");

router.get('/',
  (req, res) => {
		res.writeHead(301,
			{Location: 'https://ast99.cafe24api.com/api/v2/oauth/authorize?response_type=code&client_id=RfqI830WFC9Ljwfm2q8o7P&state=2525&redirect_uri=https://bnbnong.com:4001/api/cafe24/auth&scope=mall.read_product,mall.read_order'}
		);
		res.end();
	}
);

router.get('/auth',
	(req, res) => {
		const {code} = req.query;
		const redirect_uri = "https://bnbnong.com/%23/main/home"; // %32 => #
		const client_id = "RfqI830WFC9Ljwfm2q8o7P", client_secret="eTW86bTvbqdZxrvN9u52VF";
		var request = require("request");

		var payload = `grant_type=authorization_code&code=${code}&redirect_uri=${redirect_uri}`;
		
		var options = { method: 'POST',
			url: 'https://ast99.cafe24api.com/api/v2/oauth/token',
			headers: {
				'Authorization': `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`,
				'Content-Type': "application/x-www-form-urlencoded"
			},
			body: payload,
			json: true
		};
		
		request(options, function (error, response, body) {
			if (error) throw new Error(error);
			const {refresh_token, access_token} = body;
			// console.warn(body);
			res.writeHead(301,
				{Location: `https://bnbnong.com/#/main/home?refresh_token=${refresh_token}&access_token=${access_token}`}
			);
			res.end();
			// JSON.stringify(body)
			});
	}
)

module.exports = router;