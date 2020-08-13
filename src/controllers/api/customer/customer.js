const Customer = require('../../../models/Customer');

exports.getOrder = (req, res) => {
	Customer.getOrder(req.user, req.body, (err, msg) => {
		if(err) throw err;
		res.status(200).send(msg);
	})
}

exports.total = (req, res) => {
	Customer.total(req.user, req.body, (err, msg) => {
		if(err) throw err;
		res.status(200).send(msg);
	})
}

exports.totalUnset = (req, res) => {
	Customer.totalUnset(req.user, req.body, (err, msg) => {
		if(err) throw err;
		res.status(200).send(msg);
	})
}

exports.list = (req, res) => {
	Customer.list(req.user, req.body, (err, msg) => {
		if(err) throw err;
		res.status(200).send(msg);
	})
}

exports.listUnset = (req, res) => {
	Customer.listUnset(req.user, req.body, (err, msg) => {
		if(err) throw err;
		res.status(200).send(msg);
	})
}

exports.getCustomerOrder = (req, res) => {
	Customer.getCustomerOrder(req.params, (err, msg) => {
		if(err) throw err;
		res.status(200).send(msg);
	})
}

exports.addCustomer = (req, res) => {
	Customer.addCustomer(req.user, req.body, (err, msg) => {
		if(err) throw err;
		res.status(200).send(msg);
	})
}

exports.modifyCustomer = (req, res) => {
	Customer.modifyCustomer(req.params, req.body, (err, msg) => {
		if(err) throw err;
		res.status(200).send(msg);
	})
}

exports.activateCustomer = (req, res) => {
	Customer.activateCustomer(req.body, (err, msg) => {
		if(err) throw err;
		res.status(200).send(msg);
	})
}

exports.deactivateCustomer = (req, res) => {
	Customer.deactivateCustomer(req.body, (err, msg) => {
		if(err) throw err;
		res.status(200).send(msg);
	})
}