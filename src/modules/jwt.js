const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('./auth');
const JWT_SECRET = config.get('auth.jwt.secret');
const JWT_EXPIRATION_TIMEOUT = config.get('auth.jwt.expiresIn');

module.exports = {
  sign(user) {
    const token = jwt.sign(
      {
        user_id: user.user_id,
        company_id: user.company_id,
				email: user.email,
				role: user.role
      },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRATION_TIMEOUT,
      },
    );
    const decoded = jwt.decode(token);
    return { user, token, exp: decoded.exp };
  },
}
