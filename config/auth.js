// expose our config directly to our application using module.exports
if(process.env.production){
module.exports = {

    'facebookAuth' : {
        'clientID'        : '1482669688703523', // your App ID
        'clientSecret'    : '2b435e6c4e7dbdb299614f9aa3a44140', // your App Secret
        'callbackURL'     : 'http://lamaisonducrochet-maisonducrochet.rhcloud.com/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'        : 'ql695AmJKB5eKkca59eWHNCQJ',
        'consumerSecret'     : 'AJ47W7DSKfPlO2hUb0iD8MNVf6JRdGHgMKuyFwF981uM6FvB1E',
        'callbackURL'        : 'http://localhost:8080/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'         : '595484000001-of4dpe81n9ldvt5que7kendpejcmif71.apps.googleusercontent.com',
        'clientSecret'     : 'XUqTqqhLtAnP6yfOykQTRaJW',
        'callbackURL'      : 'http://lamaisonducrochet-maisonducrochet.rhcloud.com/auth/google/callback'
    }

};
}else{
    module.exports = {

    'facebookAuth' : {
        'clientID'        : '1482669688703523', // your App ID
        'clientSecret'    : '2b435e6c4e7dbdb299614f9aa3a44140', // your App Secret
        'callbackURL'     : 'http://localhost:8080/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'        : 'ql695AmJKB5eKkca59eWHNCQJ',
        'consumerSecret'     : 'AJ47W7DSKfPlO2hUb0iD8MNVf6JRdGHgMKuyFwF981uM6FvB1E',
        'callbackURL'        : 'http://localhost:8080/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'         : '595484000001-of4dpe81n9ldvt5que7kendpejcmif71.apps.googleusercontent.com',
        'clientSecret'     : 'XUqTqqhLtAnP6yfOykQTRaJW',
        'callbackURL'      : 'http://localhost:8080/auth/google/callback'
    }

};
}