const Product = require('../../../models/Product');

exports.getFamilyList = (req, res) => {
  Product.getFamilyList(req.user, req.params, (err, msg) => {
    if(err) throw err;
    res.status(200).send(msg);
  })
}

exports.getAllFamily = (req, res) => {
	Product.getAllFamily(req.params.categoryId, (err, msg) => {
    if(err) throw err;
    res.status(200).send(msg);
  })
}

exports.getFamilyCategory = (req, res) => {
	Product.getFamilyCategory(req.user, (err, msg) => {
    if(err) throw err;
    res.status(200).send(msg);
  })
}

exports.getUserFamilyCategory = (req, res) => {
	Product.getUserFamilyCategory(req.user, (err, msg) => {
    if(err) throw err;
    res.status(200).send(msg);
  })
}

exports.modifyFamily = (req, res) => {
  Product.modifyFamily(req.user, req.body, (err, msg) => {
    if(err) throw err;
    res.status(200).send(msg);
  })
}

