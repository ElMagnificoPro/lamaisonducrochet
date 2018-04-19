var mongoose = require('mongoose');

var newsLetterSchema = mongoose.Schema({
    email : String
});

module.exports = mongoose.model('NewsLetter', newsLetterSchema);
