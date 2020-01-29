const Plant = require('../../../models/Plant');

exports.getList = (req, res) => {
  Plant.getList(req.user, (err, msg) => {
    if(err) throw err;
    res.status(200).send(msg);
  })
}
