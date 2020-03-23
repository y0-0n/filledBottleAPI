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

exports.searchPlant = (req, res) => {
  Plant.searchPlant(req.user, req.body, (err, msg) => {
    if(err) throw err;
    res.status(200).send(msg);
  })
}

exports.deactivate = (req, res) => {
  Plant.deactivate(req.user, req.params, (err, msg) => {
    if(err) throw err;
    res.status(200).send(msg);
  })
}
