const Customer = require('../../../models/Customer');

exports.getOrder = (req, res) => {
	Customer.getOrder(req.user, req.body, (err, msg) => {
		if(err) throw err;
		res.status(200).send(msg);
	})
}
