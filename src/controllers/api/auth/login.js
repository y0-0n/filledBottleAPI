module.exports = {
  auth = (req, res, next) =>
  passport.authenticate('local',
  function (err, user, info) {
    if(err) return next(err);
    if(!user) {
      res.header('Access-Control-Allow-Origin', 'http://cosimo.iptime.org:3000');
      res.header('Access-Control-Allow-Credentials', true);
      res.status(401).json({message: 'fail'});
    } else {
      req.logIn(user, function(err) {
        if (err) return next(err);
        req.session.user = user;
        res.header('Access-Control-Allow-Origin', 'http://cosimo.iptime.org:3000');
        res.header('Access-Control-Allow-Credentials', true);
        res.json(req.user);
      });  
    }
  },
  { session: false })
}