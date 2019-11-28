const Stock = require('../../../models/Stock');

exports.manufacture = (req, res) => {
  Stock.convertStockByManufacture(req.user, req.body, (err, msg) => {
    if(err) throw err;
    res.status(200).send(msg);
  })
}
