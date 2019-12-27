const Produce = require('../../../models/Produce');

exports.getList = (req, res) => {
  Produce.getList(req.user, req.params.page, req.params.name, (err, msg) => {
    if(err) throw err;
    res.status(200).send(msg);
  })
}

exports.getDetail = (req, res) => {
  Produce.getDetail(req.user, req.params.id, (err, msg) => {
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
  let fileName = req.file ? 'produce/'+req.file.filename : '318x180.svg';

  Produce.create(req.user, req.body, fileName, (err, msg) => {
    if(err) throw err;
    res.status(200).send(msg);
  })
}