const Company = require('../../../models/Company');

exports.getInfo = (req, res) => {
	Company.getInfo(req.user.company_id, (err, msg) => {
		if(err) throw err;
		res.status(200).send(msg);
	})
}

exports.getInfoOpen = (req, res) => {
	Company.getInfoOpen(req.params.id, (err, msg) => {
		if(err) throw err;
		res.status(200).send(msg);
	})
}
