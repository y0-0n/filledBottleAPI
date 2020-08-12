const Suggestion = require('../../../../models/Suggestion');

exports.getListAdmin = (req, res) => {
  let {page} = req.body;

  Suggestion.getListAdmin(page, (err, rows) => {
    if(err) throw err;
    res.status(200).send(rows);
  })
}

exports.getTotalAdmin = (req, res) => {
  Suggestion.getTotalAdmin((err, rows) => {
    if(err) throw err;
    res.status(200).send(rows);
  })
}

exports.answer = (req, res) => {
  Suggestion.answer(req.user.id, req.body, (err, rows) => {
    if(err) throw err;
    res.status(200).send(rows);
  })
}

exports.getDetailAdmin = (req, res) => {
  Suggestion.getDetailAdmin(req.params, (err, rows) => {
    if(err) throw err;
    res.status(200).send(rows);
  })
}
