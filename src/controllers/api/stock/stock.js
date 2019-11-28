const Stock = require('../../../models/Stock');

exports.getStock = (req, res) => {
  Stock.getStock(req.user, (err, msg) => {
    if(err) throw err;
    res.status(200).send(msg);
  })
}
