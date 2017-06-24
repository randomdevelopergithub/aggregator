const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');


// /users is automatically added, e.g. /users/register etc.
//register
router.post('/register', (req,res,next) => {
    console.log("INSIDE REGISTER");
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });
    
    
    User.addUser(newUser, (err, user) => {
        console.log("user:",user);
        if(err){
            res.json({success:false,msg:'failed to register user'});
        }else{
            res.json({success:true,msg:'user registered'});
        }
    });
});

// authenticate
router.post('/authenticate', (req,res,next) => {
    const username = req.body.username;
    const password = req.body.password;
    
    User.getUserByUsername(username, (err, user) => {
        if(err) throw err;
        if(!user){
            return res.json({success:false, msg: 'User not found'});
        }
        
        User.comparePassword(password, user.password, (err, isMatch) => {
            if(err) throw err;
            if(isMatch){
                const token = jwt.sign(user, config.secret, {
                    expiresIn: 604800 // 1 week
                });
                
                res.json({
                    success: true,
                    token: 'JWT ' + token,
                    user: {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email
                    }
                });
            }else{
                return res.json({success: false, msg: 'Wrong password'});
            }
        });
    });
});

//profile
router.get('/profile', passport.authenticate('jwt', {session: false}), (req,res,next) => {
    res.json({user: req.user});
});

module.exports = router;
