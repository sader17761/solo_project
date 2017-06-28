var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// uses
router.use(bodyParser.urlencoded({extended:true}));
router.use(bodyParser.json());

mongoose.connect('localhost:27017/soloProject'); // soloProject is the DB name

// schema(s)
var collectionSchema = new mongoose.Schema({
    date: Date,
    collName: String
});


// 'collectionName' is the name of the collection in the 'soloProject' database
var collectionName = mongoose.model('collectionName', collectionSchema);


/*---- COLLECTION NAME ----*/
// posting collections to 'soloProject' database in 'collectionName' collection
router.post('/', function(req, res) {
    console.log(req.body.collName);
    collectionName.findOne({ 'collName' : req.body.collName }).then(function(response){
        if(response){
            res.send('Exists');
        } else {
            console.log('In collections.js, posting to /, req.body is:', req.body);
            collectionName(req.body).save();
            res.send(200);
        }
    });
});

router.get('/', function(req, res) {
    //console.log('In collections.js, getting from /, req.body is:', req.body);
    collectionName.find().then(function(response){
        //console.log('Collection request:', response);
        res.send(response);
    });
});

router.delete('/:id', function(req, res){
    console.log('Database collection to delete:', req.params.id);
    collectionName.remove({
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
