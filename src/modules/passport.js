const config = require('config');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const extractJWT = require('passport-jwt').ExtractJwt;
const auth = require('../modules/auth');
const Users = require('../models/Users');

const JWT_SECRET = config.get('auth.jwt.secret');

const localAuth = (email, password, done) => {
  Users.emailCheck(email, (err, rows) => {
    if(err) throw err;
    if(rows.length > 0) {
      let correctPwd = rows[0].password, salt = rows[0].salt, id = rows[0].id;
      if(correctPwd === auth.hashPassword(password, salt)){
        done(null, {
          email,
          id
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
  console.log(user)
  done(null, user);
});

passport.deserializeUser((user, done) => {
  console.log(user)
  done(null, user);
});

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, localAuth));


/*passport.use('JWT', new JWTStrategy({
  jwtFromRequest: extractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
}, (jwtUser, done) => {
  const UserModel = auth.getUserModel(jwtUser);

  UserModel.findOne({ id: jwtUser.id })
    .then((user) => {
      if (user) {
        done(null, jwtUser);
      } else {
        done(null, false);
      }
    })
    .catch((err) => {
      console.log(err);
      done(err);
    });
}));*/


module.exports = passport;