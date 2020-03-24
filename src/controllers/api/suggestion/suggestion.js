const Suggestion = require('../../../models/Suggestion');

exports.getList = (req, res) => {
  let {page} = req.params;

  Suggestion.getList(req.user.id, page, (err, rows) => {
    if(err) throw err;
    res.status(200).send(rows);
  })
}

exports.getTotal = (req, res) => {
  Suggestion.getTotal(req.user.id, (err, rows) => {
    if(err) throw err;
    res.status(200).send(rows);
  })
}

exports.getDetail = (req, res) => {
  Suggestion.getDetail(req.user.id, req.params.id, (err, rows) => {
    if(err) throw err;
    res.status(200).send(rows);
  })
}

exports.addSuggestion = (req, res) => {
  Suggestion.addSuggestion(req.user.id, req.body, (err, rows) => {
    if(err) throw err;
    res.status(200).send(rows);
  })
}