const Result = require('../../../models/Result');

exports.getProductResult = (req, res) => {
    Result.getProductResult(req.user, req.params, (err, msg) => {
      if(err) throw err;
      res.status(200).send(msg);
    })
  }
  