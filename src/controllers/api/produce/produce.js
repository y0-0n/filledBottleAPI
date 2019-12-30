const Produce = require('../../../models/Produce');

exports.getList = (req, res) => {
  let {page, keyword, first_date, last_date} = req.body;

  Produce.getList(req.user, page, keyword, first_date, last_date, (err, msg) => {
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
  let {keyword, first_date, last_date} = req.body;

  Produce.getTotal(req.user, keyword, first_date, last_date, (err, msg) => {
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