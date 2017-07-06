/*---- MAIN ROUTER ----*/

var express = require('express');
var router = express.Router();
var path = require('path');
var bcrypt = require('bcrypt');
var bodyParser = require('body-parser');
var users = require('../users'); // add in user route


router.use(bodyParser.urlencoded({extended:true}));
router.use(bodyParser.json());


router.get('/', function(req, res){
  console.log('Hit in server.');
  res.sendFile(path.resolve('public/views/index.html'));
}); // end base url


router.post('/', function(req, res) {
  console.log('Find reqUsername:', req.body.username);
    users.findOne({
        username: req.body.username
    }, function(err, users) {
      console.log('Find users:', users.username);
        if (err) {
            res.send('we don\'t got it');
        } else {
            if (users != undefined) {
                bcrypt.compare(req.body.password, users.password, function(err, isMatch) {
                    if (err) {
                        res.send('we don\'t got it');
                    } else {
                        if (isMatch) {
                            res.send('bingo');
                        } else {
                            res.send('we don\'t got it');
                        }
                    }
                });
            } else {
                res.send('we don\'t got it');
            }
        }
    });
});

router.get('/:username', function(req, res) {
    console.log('In server looking for words with username:', req.params.username);
    users.find({
      username: req.params.username
    }).then(function(response){
        console.log('User request:', response);
        res.send(response);
    });
});

module.exports = router;
