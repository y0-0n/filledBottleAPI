/**
 * POST /api/auth/emailCheck
 */
const Users = require('../../../models/Users');
const { validationResult } = require('express-validator');

exports.emailCheck = (req, res) => {
  const email = req.body.email;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log('Fail')
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
