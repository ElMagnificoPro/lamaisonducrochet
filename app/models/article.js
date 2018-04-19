//load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var articleSchema = mongoose.Schema({
    nom          : String,
    src       	 : [String],
    description  : String,
    categorie    : [String],
    prix         : Number,
    solde    	 : Number,
    isSolde      : Boolean,
    featured	 : Boolean
});

// create the model for Article and expose it to our app
module.exports = mongoose.model('Article', articleSchema);
