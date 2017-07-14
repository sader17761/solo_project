var mongoose = require('mongoose');

mongoose.connect('mongodb://heroku_slxq9vxw:khsmdc4e3s3n475nqi098l7sth@ds159662.mlab.com:59662/heroku_slxq9vxw'); //localhost:27017/soloProject

// schema(s)
var userSchema = new mongoose.Schema({
    fname: String,
    lname: String,
    email: String,
    username: String,
    password: String,
    grade: String,
    adminRights: Number,
    image: String
});

// 'userRegistration' is the name of the collection in the 'soloProject' database
var userRegistration = mongoose.model('userRegistration', userSchema);


module.exports = userRegistration;
