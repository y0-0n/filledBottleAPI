const Stock = require('../../../models/Stock');
const Manufacture = require('../../../models/Manufacture');

exports.manufacture = (req, res) => {
  Manufacture.addManufacture(req.user, req.body, (err, msg) => {
    if(err) throw err;
    Stock.convertStockByManufacture(req.user, req.body, (err, msg) => {
      if(err) throw err;
      res.status(200).send(msg);
    })
  })
}

exports.getList = (req, res) => {
  Manufacture.getList(req.user, (err, msg) => {
    if(err) throw err;
    res.status(200).send(msg);
  })
}

exports.getDetail = (req, res) => {
  Manufacture.getDetail(req.user, req.params, (err, msg) => {
    if(err) throw err;
    Stock.getStockFromManufactureByConsume(msg[0].id, (err, msg2) => {
      if(err) throw err;
      Stock.getStockFromManufactureByProduce(msg[0].id, (err, msg3) => {
        if(err) throw err;
        res.status(200).send({info: msg, consume: msg2, produce: msg3});
      })
    })
  })
}