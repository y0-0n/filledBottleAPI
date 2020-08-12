const config = require('config');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const extractJWT = require('passport-jwt').ExtractJwt;
const auth = require('../modules/auth');
const Users = require('../models/Users');

const JWT_SECRET = config.get('auth.jwt.secret');

const localAuth = (email, password, done) => {
  Users.getAuthInfo(email, (err, rows) => {
    if(err) return done(err);
    if(rows.length > 0) {
      let correctPwd = rows[0].password, {salt, user_id, company_id, role} = rows[0];
      if(correctPwd === auth.hashPassword(password, salt)){
        done(null, {
          email,
          user_id,
          company_id,
					role
        })
      } else {
        done(null, false, 'Wrong Password');
      }
    } else {
      done(null, false, 'No Users');
    }
  })
};

passport.serializeUser((user, done) => {
  console.log('s: ', user)
  done(null, user);
});

passport.deserializeUser((user, done) => {
  console.log('ds: ', user);
  done(null, user);
});

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, localAuth));

passport.use('JWT', new JWTStrategy({
  jwtFromRequest: extractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
}, (jwtUser, done) => {
  Users.getAuthInfo(jwtUser.email, (err, rows) => {
    if(err) throw err;
    if(rows.length > 0) {
      done(null, jwtUser);
    } else {
      done(null, false);
    }
  })
}));

module.exports = passport;