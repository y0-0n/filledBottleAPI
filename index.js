var express    = require('express');
const passport = require('passport');

var app = express();
//routes
const index = require('./src/routes/index');
const customer = require('./src/routes/customer');
const product = require('./src/routes/product');
const plant = require('./src/routes/plant');
const order = require('./src/routes/order');
const stock = require('./src/routes/stock');

// configuration ===============================================================
app.set('port', process.env.PORT || 4000);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());


app.use(index);
app.use(customer);
app.use(product);
app.use(plant);
app.use(order);
app.use(stock);

//===============================================================

app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});