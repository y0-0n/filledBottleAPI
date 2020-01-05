const Stock = require('../../../models/Stock');

exports.getStock = (req, res) => {
  Stock.getStock(req.user, (err, msg) => {
    if(err) throw err;
    res.status(200).send(msg);
  })
}

exports.getStockList = (req, res) => {
  Stock.getStockList(req.user, req.params.page, (err, msg) => {
    if(err) throw err;
    res.status(200).send(msg);
  })
}

exports.getStockList2 = (req, res) => {
  Stock.getStockList2(req.user, req.body, (err, msg) => {
    if(err) throw err;
    res.status(200).send(msg);
  })
}


exports.getStockDetail = (req, res) => {
  Stock.getStockDetail(req.user, req.params.id, (err, msg) => {
    if(err) throw err;
    res.status(200).send(msg);
  })
}

exports.convertStock = (req, res) => {
  const {id} = req.params;
  const {quantity} = req.body;
  Stock.convertStock(id, quantity, req.user, '재고 직접 수정', (err, msg) => {
    if(err) throw err;
    res.status(200).send(msg);
  })
}
