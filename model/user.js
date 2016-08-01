var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: String,
    login: String,
    pass: String
});
module.exports = mongoose.model('User', userSchema);