var express    = require('express');
const passport = require('passport');

var app = express();
//routes
const index = require('./src/routes/index');
const customer = require('./src/routes/customer');
const product = require('./src/routes/product');

// configuration ===============================================================
app.set('port', process.env.PORT || 4000);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());


app.use(index);
app.use(customer);
app.use(product);

//===============================================================

app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});