const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');


//creating the token for each user based on ID 
//jwt.io for more resources on how to use tokens 
function tokenForUser(user) {
    const timestamp = new Date().getTime();
    return jwt.encode({sub: user.id, iat:timestamp},config.secret);
}

exports.signin = function(req, res, next){
    //user has already had their email and password auth'd, just need token
    res.send({token: tokenForUser(req.user)});
};

exports.signup = function(req, res, next){
    const email = req.body.email;
    const password = req.body.password;
    
    if(!email || !password){
        return res.status(422).send({error: 'Must provide email and password'})
    };
    
    // See if a user exists
    User.findOne({email:email}, function(err,existingUser) {
        if (err) {return next(err);}
        
    // if a user with email does exist, return error
        if(existingUser) {
            return res.status(422).send({error: 'Email in use'});
        }
    // if not than create and save
        const user = new User({
           email: email,
            password: password
        });
        
        user.save(function(err){
            if (err) {return next(err);}

    // respond to the request
            res.json({token: tokenForUser(user)});
        });
        
        
    });


    
};