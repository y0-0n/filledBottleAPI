
const Users = require('../../../models/Users');

exports.info = (req, res) => {
  Users.info(req.user.id, (err, rows) => {
    if(err) throw err;
    res.status(200).send(rows);
  })
}