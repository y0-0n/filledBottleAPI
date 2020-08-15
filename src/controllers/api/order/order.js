const Order = require('../../../models/Order');

exports.total = (req, res) => {
	Order.total(req.user, req.body, (err, msg) => {
		if(err) throw err;
		res.status(200).send(msg);
	})
}

exports.totalRefund = (req, res) => {
	Order.totalRefund(req.user, req.body, (err, msg) => {
		if(err) throw err;
		res.status(200).send(msg);
	})
}

exports.list = (req, res) => {
	Order.list(req.user, req.body, (err, msg) => {
		if(err) throw err;
		res.status(200).send(msg);
	})
}

exports.listRefund = (req, res) => {
	Order.listRefund(req.user, req.body, (err, msg) => {
		if(err) throw err;
		res.status(200).send(msg);
	})
}

exports.todayShipping = (req, res) => {
	Order.todayShipping(req.user, (err, msg) => {
		if(err) throw err;
		res.status(200).send(msg);
	})
}

exports.orderProduct = (req, res) => {
	Order.orderProduct((err, msg) => {
		if(err) throw err;
		res.status(200).send(msg);
	})
}

exports.orderSummary = (req, res) => {
	Order.orderSummary((err, msg) => {
		if(err) throw err;
		res.status(200).send(msg);
	})
}

exports.incomeYM = (req, res) => {
	Order.incomeYM(req.params, req.user, (err, msg) => {
		if(err) throw err;
		res.status(200).send(msg);
	})
}

exports.receiveYM = (req, res) => {
	Order.receiveYM(req.params, req.user, (err, msg) => {
		if(err) throw err;
		res.status(200).send(msg);
	})
}

exports.amountYM = (req, res) => {
	Order.amountYM(req.params, req.user, (err, msg) => {
		if(err) throw err;
		res.status(200).send(msg);
	})
}

exports.addOrder = (req, res) => {
	Order.addOrder(req.user, req.body, (err, msg) => {
		if(err) throw err;
		res.status(200).send(msg);
	})
}

exports.getDetail = (req, res) => {
	Order.getDetail(req.params, (err, msg) => {
		if(err) throw err;
		res.status(200).send(msg);
	})
}

exports.getDetailRefund = (req, res) => {
	Order.getDetailRefund(req.body, (err, msg) => {
		if(err) throw err;
		res.status(200).send(msg);
	})
}

exports.changeState = (req, res) => {
	Order.changeState(req.user, req.body, (err, msg) => {
		if(err) throw err;
		res.status(200).send(msg);
	})
}

exports.modifyOrder = (req, res) => {
	Order.modifyOrder(req.user, req.params, req.body, (err, msg) => {
		if(err) throw err;
		res.status(200).send(msg);
	})
}