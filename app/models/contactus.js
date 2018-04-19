var mongoose = require('mongoose');

var contactUsSchema = mongoose.Schema({
    email : String,
    name : String,
    message : String
});

module.exports = mongoose.model('contactUs', contactUsSchema);