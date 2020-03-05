const Stock = require('../../../models/Stock');

exports.getStockQuantity = (req, res) => {
  Stock.getStockQuantity(req.user, (err, msg) => {
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

exports.getStockHistoryTotal = (req, res) => {
  Stock.getStockHistoryTotal(req.user, req.body, (err, msg) => {
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

exports.getStockTotal = (req, res) => {
  Stock.getStockTotal(req.user, req.body, (err, msg) => {
    if(err) throw err;
    res.status(200).send(msg);
  })
}

/*exports.getStockList3 = (req, res) => {
  Stock.getStockList3(req.user, req.body, (err, msg) => {
    if(err) throw err;
    res.status(200).send(msg);
  })
}*/

exports.getStockSum = (req, res) => {
  Stock.getStockSum(req.user, req.body, (err, msg) => {
    if(err) throw err;
    res.status(200).send(msg);
  })
}

exports.getLastStock = (req, res) => {
  Stock.getLastStock(req.body, req.user, (err, msg) => {
    if(err) throw err;
    res.status(200).send(msg);
  })
}

exports.transportStock = (req, res) => {
  Stock.transportStock(req.body, req.user, (err, msg) => {
    if(err) throw err;
    res.status(200).send(msg);
  })
}
exports.getStockHistoryList = (req, res) => {
  Stock.getStockHistoryList(req.user, req.body, (err, msg) => {
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

exports.createStock = (req, res) => {
  Stock.createStock(req.user, req.body, '재고 직접 수정', (err, msg) => {
    if(err) throw err;
    res.status(200).send(msg);
  })
}
