const Company = require('../../../../models/Company');

exports.getListAdmin = (req, res) => {
	const {page, perPage} = req.query;
	Company.getListAdmin({page, perPage}, (err, msg) => {
		if(err) throw err;
		res.status(200).send(msg);
	})
}

exports.getTotalAdmin = (req, res) => {
	Company.getTotalAdmin((err, msg) => {
		if(err) throw err;
		res.status(200).send(msg);
	})
}

exports.getDetailAdmin = (req, res) => {
	Company.getDetailAdmin(req.params.id, (err, msg) => {
		if(err) throw err;
		res.status(200).send(msg);
	})
}

exports.createAdmin = (req, res) => {
	Company.createAdmin(req.body, (err, msg) => {
		if(err) throw err;
		res.status(200).send(msg);
	})
}
