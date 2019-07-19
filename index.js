var mysql      = require('mysql');
var express    = require('express');

var app = express();

//routes
const index = require('./src/routes/index');
const customer = require('./src/routes/customer');

// configuration ===============================================================
app.set('port', process.env.PORT || 4000);

app.use(index);
app.use(customer);

app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});