const Suggestion = require('../../../models/Suggestion');

exports.getSuggestion = (req, res) => {
  Suggestion.getSuggestion(req.user.id, (err, rows) => {
    if(err) throw err;
    res.status(200).send(rows);
  })
}

exports.getSuggestionById = (req, res) => {
  Suggestion.getSuggestionById(req.user.id, req.params.id, (err, rows) => {
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