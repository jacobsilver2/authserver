const User = require('../models/user');
const jwt = require('jwt-simple')
const config = require('../config');

function tokenForUser(user) {
    //first arg is the information we want to encode, second argument is the secret we want to use to encrpyt it with

    //the sub key refers to "subject", or, this specfic user.
    //iat key refers to "issued at time"
    const timestamp = new Date().getTime();
    return jwt.encode( { sub: user.id, iat: timestamp }, config.secret)
}

exports.signin = function(req, res, next) {
    // User has already had their email and password auth'd
    // We just need to give them a token
    res.send({ token: tokenForUser(req.user)});
}


exports.signup = function(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.status(422).send({ error: 'You must provide an email and password'});
    }

//? ────────────────────────────────────────────────────────────────────────────────

    // see if a user with the given email exists
    User.findOne( { email: email }, function(err, existingUser) {
       if (err) { return next(err); };

       //if a user with email does exist, return an error
       if (existingUser) {
        return res.status(422).send( {error: 'Email is in use'} )
       };
       
       //if a user with email does NOT exist, create and save user record
       const user = new User({
           email: email,
           password: password
       });

       user.save(function(err){
           if(err){return next(err)};
           // respond to request indicating the user was created
           res.json({token: tokenForUser(user)})
       });
    });
};