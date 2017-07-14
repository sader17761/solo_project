var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// uses
router.use(bodyParser.urlencoded({extended:true}));
router.use(bodyParser.json());

mongoose.connect('mongodb://heroku_1pt5g1s5:gk08nvokdtafa90o5lpjiov7ea@ds157702.mlab.com:57702/heroku_1pt5g1s5'); // soloProject is the DB name

// schema(s)
var resultsSchema = new mongoose.Schema({
    date: Date,
    collName: String,
    studentName: String,
    numWordsCorrect: Number,
    numWordsIncorrect: Number,
    wordsIncorrect: Array
});

// 'quizResults' is the name of the collection in the 'soloProject' database
var quizResults = mongoose.model('quizResults', resultsSchema);


/*---- QUIZ RESULTS ----*/
// posting quiz results to 'soloProject' database in 'quizResults' collection
router.post('/', function(req, res) {
    //console.log('In score.js, posting to /, req.body is:', req.body);
    quizResults(req.body).save();
    res.send(200);
});

router.get('/', function(req, res) {
    //console.log('In score.js, getting from /, req.body is:', req.body);
    quizResults.find().then(function(response){
        console.log('Quiz results request:', response);
        res.send(response);
    });
});







module.exports = router;
