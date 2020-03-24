module.exports.checkAuthed = (req, res, next) => {
  if (req.isAuthenticated()) {
		next();
  } else {
    res.header('Access-Control-Allow-Origin', '*');
		res.status(401).json({ message: 'Not logged in!' });
    //res.redirect(301, 'http://cosimo.iptime.org:3000/#/login')
  }
}

module.exports.checkAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role == 5) {
		next();
  } else {
    res.header('Access-Control-Allow-Origin', '*');
		res.status(401).json({ message: 'Not logged in!' });
    //res.redirect(301, 'http://cosimo.iptime.org:3000/#/login')
  }
}
