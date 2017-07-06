var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var bcrypt = require( 'bcrypt' );
var mongoose = require('mongoose');

// uses
router.use(bodyParser.urlencoded({extended:true}));
router.use(bodyParser.json());

mongoose.connect('localhost:27017/soloProject'); // soloProject is the DB name

// schema(s)
var userSchema = new mongoose.Schema({
    fname: String,
    lname: String,
    email: String,
    username: String,
    password: String,
    grade: String,
    adminRights: Number
});

// 'userRegistration' is the name of the collection in the 'soloProject' database
var userRegistration = mongoose.model('userRegistration', userSchema);


/*----  USER REGISTRATION ----*/
// posting collections to 'soloProject' database in 'collectionName' collection
router.post('/', function(req, res) {
    console.log('In register.js, posting to /, req.body is:', req.body);
    bcrypt.genSalt(12, function(err, salt){
        if(err){
            res.sendStatus(400);
        } else {
            bcrypt.hash(req.body.password, salt, function(err, hash){
                if(err){
                    res.sendStatus(400);
                } else {
                    var newUser = {
                        fname: req.body.fname,
                        lname: req.body.lname,
                        email: req.body.email,
                        username: req.body.username,
                        password: hash,
                        grade: req.body.grade,
                        adminRights: req.body.adminRights
                    };
                    console.log('newUser is:', newUser);
                    userRegistration(newUser).save();
                    res.sendStatus( 201 );
                }
            });
        }
    });
});








module.exports = router;
