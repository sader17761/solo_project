/*---- MAIN ROUTER ----*/

var express = require('express');
var router = express.Router();
var path = require('path');
var bcrypt = require('bcrypt');
var bodyParser = require('body-parser');

router.get('/', function(req, res){
  console.log('Hit in base url.');
  res.sendFile(path.resolve('public/views/index.html'));
}); // end base url

module.exports = router;
