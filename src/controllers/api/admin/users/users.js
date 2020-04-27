const Users = require('../../../../models/Users');
const models = require('../../../../../models');
exports.getListAdmin = (req, res) => {
  Users.getListAdmin(req.body, (err, rows) => {
    if(err) throw err;
    // models.users.findAll()
    // .then(result => {
    //   //sequelize 도입 성공 예시
    //   console.warn(JSON.stringify(result))
    //   res.status(200).send(result)
    // })
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

exports.getDetailProductAdmin = (req, res) => {
	const {id} = req.params;
	// console.warn(id)
	models.product.findAll({
		where: {
			user_id: id
		}
	})
	.then(result => {
    res.status(200).send(result);
	})
}

exports.getProductFamilyAdmin = (req, res) => {
  Users.getProductFamilyAdmin(req.user.id, req.params, (err, rows) => {
    if(err) throw err;
    res.status(200).send(rows);
  })
}
