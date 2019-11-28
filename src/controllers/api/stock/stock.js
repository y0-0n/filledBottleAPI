const Stock = require('../../../models/Stock');

exports.getStock = (req, res) => {
  Stock.getStock(req.user, (err, msg) => {
    if(err) throw err;
    res.status(200).send(msg);
  })
}

exports.getStockDetail = (req, res) => {
  Stock.getStockDetail(req.user, req.params.id, (err, msg) => {
    if(err) throw err;
    res.status(200).send(msg)
  })
}