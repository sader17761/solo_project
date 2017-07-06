var mongoose = require('mongoose');

mongoose.connect('localhost:27017/soloProject');

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


module.exports = userRegistration;
