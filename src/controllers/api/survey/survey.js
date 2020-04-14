const Survey = require('../../../models/Survey');

exports.getQuestionList = (req, res) => {
  Survey.getQuestionList(req.user.id, (err, rows) => {
    if(err) throw err;
    res.status(200).send(rows);
  })
}
