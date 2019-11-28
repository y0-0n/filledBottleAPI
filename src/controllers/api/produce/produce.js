const Stock = require('../../../models/Stock');

exports.produce = (req, res) => {
  Stock.convertStock(req.user, req.body, (err, msg) => {
    if(err) throw err;
    res.status(200).send(msg);
  })
}
