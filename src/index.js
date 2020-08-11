let express    = require('express');
const passport = require('passport');
let cors = require('cors');
let path = require('path');
const session = require('express-session');
const fs = require('fs');
const https = require('https');

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
app.use( cors() );
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
app.use('/d', express.static(path.join(__dirname, '../build')));
app.use('/customer', 
  passport.authenticate('JWT', { session: false }),
  customer
);

app.use('/api', api);

app.use('/product', 
  passport.authenticate('JWT', { session: false }),
  product
);

//app.use(plant);

app.use('/order',
  passport.authenticate('JWT', { session: false }),
  order
);

app.use('/stock',
  passport.authenticate('JWT', { session: false }),
  stock
);

app.use('/users', users);

//====================  cors  ==========================================
var whitelist = ['https://localhost:8080']

var corsOptions = {

  origin: function(origin, callback){

  var isWhitelisted = whitelist.indexOf(origin) !== -1;

  callback(null, isWhitelisted); 

  // callback expects two parameters: error and options 

  },

  credentials:true

}


//===============================================================
// const options = {
// 	key: fs.readFileSync(__dirname+'/private.pem', 'utf8'),
// 	cert: fs.readFileSync(__dirname+'/public.pem', 'utf8')
// }

app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});

// https.createServer(options, app).listen(4001, function() {
//   console.log('Express server listening on port ' + 4001);
// })

