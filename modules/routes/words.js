var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// uses
router.use(bodyParser.urlencoded({extended:true}));
router.use(bodyParser.json());

mongoose.connect('localhost:27017/soloProject'); // soloProject is the DB name

// schema
var wordSchema = new mongoose.Schema({
    collectionId: String,
    collectionName: String,
    word: String,
    rating: Number,
    dateAdded: Date
});


// 'wordCollection' is the name of the collection in the 'soloProject' database
var wordCollection = mongoose.model('wordCollection', wordSchema);


/*---- WORD COLLECTION ----*/
// posting word to 'soloProject' database in 'wordCollection1' collection
router.post('/', function(req, res) {
    console.log('In word.js, posting to /, req.body is:', req.body);
    wordCollection(req.body).save();
    res.send(200);
});

router.get('/', function(req, res) {
    console.log('In word.js, getting from /, req.body is:', req.body);
    wordCollection.find().then(function(response){
        console.log('Collection request:', response);
        res.send(response);
    });
});

router.delete('/:id', function(req, res){
    console.log('Database item deleted:', req.params.id);
    wordCollection.remove({
        _id: req.params.id
    }).then(function(err){
        if(err){
            res.send('Delete Success!');
        } else {
            res.send('Delete Error!');
        }
    });
});


module.exports = router;
