/*---- SERVER SIDE ----*/

// routes
var express = require( 'express' );
var app = express();
var bodyParser = require( 'body-parser' );
var path = require( 'path' );
var index = require( './modules/routes/index' );
var words = require('./modules/routes/words');
var collections = require('./modules/routes/collections');
var score = require('./modules/routes/score');
var register = require('./modules/routes/register');

// uses
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use( '/', index );
app.use( '/words', words);
app.use( '/collections', collections);
app.use( '/score', score);
app.use( '/register', register);

// globals
var port = process.env.PORT || 3608;

// spin up server
app.listen(port, function(){
  console.log('Server running on: ', port);
}); // end of app.listen
