var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// uses
router.use(bodyParser.urlencoded({extended:true}));
router.use(bodyParser.json());

mongoose.connect('mongodb://heroku_1pt5g1s5:gk08nvokdtafa90o5lpjiov7ea@ds157702.mlab.com:57702/heroku_1pt5g1s5'); // soloProject is the DB name

// schema
var wordSchema = new mongoose.Schema({
    collectionId: String,
    collectionName: String,
    word: String,
    sentence: String,
    gradeLevel: String,
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

router.put('/', function(req, res) {
    console.log('In word.js, putting from /, req.body is:', req.body);
    wordCollection.findOneAndUpdate({_id: req.body._id},
        {$set:
              {
                  word: req.body.word,
                  sentence: req.body.sentence
              }
         }
    ).then(function(response){
        console.log('Word update request:', response);
        res.send(response);
    });
});

router.get('/:id', function(req, res) {
    console.log('In server looking for words with id:', req.params.id);
    wordCollection.find({
      collectionId: req.params.id
    }).then(function(response){
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
