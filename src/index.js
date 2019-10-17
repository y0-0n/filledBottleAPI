let express    = require('express');
const passport = require('passport');
let cors = require('cors');
let path = require('path');

let app = express();
//routes
const index = require('./controllers');
const customer = require('./controllers/customer');
const product = require('./controllers/product');
const plant = require('./controllers/plant');
const order = require('./controllers/order');
const stock = require('./controllers/stock');
const users = require('./controllers/users');
const api = require('./controllers/api');

// configuration ===============================================================
app.set('port', process.env.PORT || 4000);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(path.join(__dirname+'/../public')));

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