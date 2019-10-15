var express    = require('express');
const passport = require('passport');
var cors = require('cors');

var app = express();
//routes
const index = require('./src/routes/');
const customer = require('./src/routes/customer');
const product = require('./src/routes/product');
const plant = require('./src/routes/plant');
const order = require('./src/routes/order');
const stock = require('./src/routes/stock');
const users = require('./src/routes/users');
const api = require('./src/routes/api');

// configuration ===============================================================
app.set('port', process.env.PORT || 4000);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(__dirname + '/public'));
app.use(passport.initialize());

app.use('/', index);
app.use('/customer', customer);
app.use('/api', api);
app.use('/product', product);
//app.use(plant);
app.use('/order', order);
app.use('/stock', stock);
app.use('/users', users);


//====================  cors  ==========================================
var whitelist = ['ec2-54-180-104-51.ap-northeast-2.compute.amazonaws.com']

var corsOptions = {

  origin: function(origin, callback){

  var isWhitelisted = whitelist.indexOf(origin) !== -1;

  callback(null, isWhitelisted); 

  // callback expects two parameters: error and options 

  },

  credentials:true

}

app.use( cors(corsOptions) );                                                                                                            

//===============================================================

app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});