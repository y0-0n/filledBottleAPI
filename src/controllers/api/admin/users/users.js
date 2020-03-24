const Users = require('../../../../models/Users');

exports.getListAdmin = (req, res) => {
  Users.getListAdmin(req.user.id, req.body, (err, rows) => {
    if(err) throw err;
    res.status(200).send(rows);
  })
}

exports.getTotalAdmin = (req, res) => {
  Users.getTotalAdmin(req.user.id, (err, rows) => {
    if(err) throw err;
    res.status(200).send(rows);
  })
}

exports.getDetailAdmin = (req, res) => {
  Users.getDetailAdmin(req.user.id, req.params, (err, rows) => {
    if(err) throw err;
    res.status(200).send(rows);
  })
}

exports.getProductFamilyAdmin = (req, res) => {
  Users.getProductFamilyAdmin(req.user.id, req.params, (err, rows) => {
    if(err) throw err;
    res.status(200).send(rows);
  })
}
