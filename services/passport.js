const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');


//! ────────────────────────────────────────────────────────────────────────────────
//! create local strategy

//when you want to get access to the username, look at the email property
const localOptions = { usernameField: 'email'}
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
    //verify this email and password, call done with the user if correct
    //otherwise call done with false
    User.findOne({ email: email }, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }

        // compare passwords - is 'password' equal to user.password?
        user.comparePassword(password, function(err, isMatch) {
            if (err) { return done(err); }
            if (!isMatch) { return done(null, false);}

            return done(null, user)
        })
        // remember that the password is salted
    })
});

// setup options for jwt strategy
const jwtOptions = {
    //whenever a request comes in, look at the header called authorization
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret
};

//! ────────────────────────────────────────────────────────────────────────────────
//! create a jwt strategy
//payload is the decoded jwt token
//done is a callback function that we need to call if we successfully call back the user
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
    //see if the user id in the payload exists in db
    //if it does call done with that user
    //otherwise call done without a user object
    User.findById(payload.sub, function(err, user) {
        if (err) { return done(err, false); }

        if(user) {
            done(null, user);
        } else {
            done(null, false)
        }
    });

})

//tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);