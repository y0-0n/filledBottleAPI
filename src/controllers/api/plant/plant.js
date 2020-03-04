const Plant = require('../../../models/Plant');

exports.getList = (req, res) => {
  Plant.getList(req.user, (err, msg) => {
    if(err) throw err;
    res.status(200).send(msg);
  })
}

exports.add = (req, res) => {
  Plant.add(req.user, req.body, (err, msg) => {
		if(err) throw err;
    res.status(200).send(msg);
  })
}
