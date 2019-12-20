const Product = require('../../../models/Product');

exports.getFamilyList = (req, res) => {
  Product.getFamilyList(req.user, (err, msg) => {
    if(err) throw err;
    res.status(200).send(msg);
  })
}

exports.addFamily = (req, res) => {
  Product.addFamily(req.user, req.body, (err, msg) => {
    if(err) throw err;
    res.status(200).send(msg);
  })
}
