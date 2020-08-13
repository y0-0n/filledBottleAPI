const Users = require('../../../../models/Users');
const auth = require("../../../../modules/auth");
const { validationResult } = require('express-validator');
const Plant = require('../../../../models/Plant');

// const models = require('../../../../../models');
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
  Users.getTotalAdmin((err, rows) => {
    if(err) throw err;
    res.status(200).send(rows);
  })
}

exports.createAdmin = (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {//유효하지 않은 회원가입 정보
		return res.status(422).json({ errors: errors.array() });
  }
  data = req.body;
  // console.warn(data)
  data.company_id = data.farmId
	const salt = auth.generateSalt();
	data.salt = salt;
	data.password = auth.hashPassword(data.password, salt);
	Users.emailCheck(req.body.email, (err, count) => {
		if(err) throw err;
		if(count > 0) {//이미 있는 계정일 경우
			return res.status(400).json({ message: "THe email already exists" });
		} else {//회원가입 성공
			Users.addUser(data, (err, result) => {
				if(err) throw err;

				Plant.add({id: data.company_id}, {plantName: "기본"}, (err, msg) => {
					if(err) throw err;
					res.status(200).send({message: "Success"});
					console.log(result, msg);
				})
			});
		}
	})
}

exports.getDetailAdmin = (req, res) => {
  Users.getDetailAdmin(req.params.id, (err, rows) => {
    if(err) throw err;
    res.status(200).send(rows);
  })
}

exports.getDetailProductAdmin = (req, res) => {
	const {id} = req.params;
	// console.warn(id)
}

exports.getProductFamilyAdmin = (req, res) => {
  Users.getProductFamilyAdmin(req.user.id, req.params, (err, rows) => {
    if(err) throw err;
    res.status(200).send(rows);
  })
}
