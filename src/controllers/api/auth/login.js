const passport = require('../../../modules/passport');
const jwt = require('../../../modules/jwt');

exports.auth = (req, res, done) =>
  passport.authenticate('local',
  function (err, user, info) {
    if(err) return done(err);
    if(!user) {
      res.header('Access-Control-Allow-Origin', 'http://cosimo.iptime.org:3000');
      res.header('Access-Control-Allow-Credentials', true);
      res.status(401).json({message: 'fail'});
    } else {
      req.logIn(user, function(err) {
        if (err) return next(err);
        done(null, user)
      });  
    }
  },
  { session: false })(req, res, done);

exports.authResponse = (req, res) => {
  res.header('Access-Control-Allow-Origin', 'http://cosimo.iptime.org:3000');
  res.header('Access-Control-Allow-Credentials', true);
  res.json(jwt.sign(req.user));
};
  