const Stock = require('../../../models/Stock');

exports.getStockQuantity = (req, res) => {
  Stock.getStockQuantity(req.user, (err, msg) => {
    if(err) throw err;
    res.status(200).send(msg);
  })
}

exports.getStockList = (req, res) => {
  Stock.getStockList(req.user, req.body, (err, msg) => {
    if(err) throw err;
    res.status(200).send(msg);
  })
}

exports.getStockProduct = (req, res) => {
  const { params } = req;
  const data = { ...params }
  Stock.getStockProduct(req.user, data, (err, msg) => {
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

//재고 실사에서 페이지네이션 없이 리스트 전달
exports.getStockList3 = (req, res) => {
  Stock.getStockList3(req.user, req.body, (err, msg) => {
    if(err) throw err;
    res.status(200).send(msg);
  })
}

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
  Stock.getStockDetail(req.user, req.params, (err, msg) => {
    if(err) throw err;
    res.status(200).send(msg);
  })
}

exports.getStockOrder = (req, res) => {
  Stock.getStockOrder(req.user, req.params, (err, msg) => {
    if(err) throw err;
    res.status(200).send(msg);
  })
}


exports.modifyStock = (req, res) => {
  const {stockData} = req.body;
  Stock.modifyStock(stockData, req.user, (err, msg) => {
    if(err) throw err;
    res.status(200).send(msg);
  })
}

exports.createStock = (req, res) => {
  Stock.createStock(req.user, req.body, (err, msg) => {
    if(err) throw err;
    res.status(200).send(msg);
  })
}
