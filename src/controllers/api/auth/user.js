
const Users = require('../../../models/Users');

exports.info = (req, res) => {
  Users.info(req.user.id, (err, rows) => {
    if(err) throw err;
    res.header("Access-Control-Allow-Origin", "http://cosimo.iptime.org:3000");
    res.header('Access-Control-Allow-Credentials', true);
    res.status(200).send(rows);
  })
}