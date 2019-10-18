let express    = require('express');
const passport = require('passport');
let cors = require('cors');
let path = require('path');
const session = require('express-session');

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

app.use(session({
  secret: 'ChangeItLaterToRandom',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
  }
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/customer', customer);
app.use('/api', api);
app.use('/product', product);
//app.use(plant);
app.use('/order', order);
app.use('/stock', stock);
app.use('/users', users);

//====================  cors  ==========================================
var whitelist = ['http://cosimo.iptime.org:3000']

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