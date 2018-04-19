//load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
        password     : String,
    },
    facebook         : {
        id           : String,
        token        : String,
        name         : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String
    },
    google           : {
        id           : String,
        token        : String,
        name         : String
    },
    pending      :Boolean,
    email        : String,
    nom          : String,
    prenom       : String,
    CIN          : String,
    adresse      : String,
    Zip          : String,
    etat         : String,
    ville        : String,
    telephone    : String,
    news         :Boolean,
    connectionType: String,
    verified     :Boolean,
    verifyMail  :Number,
    historique: [{
        order_id : String,
        date: Date,
        order_items: [{
            article_id:String,
            article_name:String,
            article_prix:Number,
            article_qty:Number
        }],
        order_details:[{
            discount: Number,
            gift:Number,
            shipping:Number,
            adresse_livraison:String
        }]
    }]

});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    if(this.local.password != null) {
        return bcrypt.compareSync(password, this.local.password);
    } else {
        return false;
    }
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
