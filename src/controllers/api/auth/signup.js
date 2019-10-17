/**
 * POST /api/auth/emailCheck
 */
const auth = require("../../../modules/auth");
const Users = require('../../../models/Users');
const { validationResult } = require('express-validator');

exports.addUser = (req, res) => {
	const errors = validationResult(req);
	res.header("Access-Control-Allow-Origin", "*");

	if(!errors.isEmpty()) {//유효하지 않은 회원가입 정보
		return res.status(422).json({ errors: errors.array() });
	}
	data = req.body;
	const salt = auth.generateSalt();
	data.password = auth.hashPassword(data.password, salt);
	Users.emailCheck(req.body.email, (err, rows) => {
		if(rows.length > 0) {//이미 있는 계정일 경우
			return res.status(400).json({ message: "THe email already exists" });
		} else {//회원가입 성공
			Users.addUser(data, (err, result) => {
				if(err) throw err;
		
				console.log(result);
			});
		
			res.status(200).send({message: "Success"});		
		}
	})
}


exports.emailCheck = (req, res) => {
  const email = req.body.email;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
	Users.emailCheck(email, (error, result) => {
		if (error) throw error;
		if (result.length > 0) {
			return res.json(
				{
					message: "You can't use it",
					isCheck: false
				}
			);
		} else {
			return res.json(
				{
					message: "You can use it",
					isCheck: true
				}
			);
		}
	});
};
