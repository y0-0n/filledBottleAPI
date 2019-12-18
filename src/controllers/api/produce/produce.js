const Produce = require('../../../models/Produce');

exports.getList = (req, res) => {
  Produce.getList(req.user, req.params.page, req.params.name, (err, msg) => {
    if(err) throw err;
    res.status(200).send(msg);
  })
}

exports.getDetail = (req, res) => {
  Produce.getStockDetail(req.user, req.params.id, (err, msg) => {
    if(err) throw err;
    res.status(200).send(msg);
  })
}

exports.getTotal = (req, res) => {
  Produce.getTotal(req.user, req.params.name, (err, msg) => {
    if(err) throw err;
    res.status(200).send(msg);
  })
}

exports.create = (req, res) => {
  Produce.create(req.user, req.body, (err, msg) => {
    if(err) throw err;
    res.status(200).send(msg);
  })
}