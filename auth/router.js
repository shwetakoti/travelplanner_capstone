'use strict';
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const config = require('../config');
const {restaurants,users} = require('../models');
//const {localStrategy, jwtStrategy} = require('./strategies');
const router = express.Router();

//const { users } = require('../models');
const { JWT_SECRET } = require('../config');

const createAuthToken = function(user)
 {
  console.log('I am in createAuthToken');
  //console.log(user);
  return jwt.sign({user}, config.JWT_SECRET, {
    subject:  user.userName,
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256'
  });
};

const localAuth = passport.authenticate('local', {session: false});
const jsonParser = router.use(bodyParser.json());
// The user provides a username and password to login

router.post('/login',(req,res,err) => {
  users.findOne
  ({
      'user.userName' : req.body.userName
   }).then(user => {
       console.log(user);
       if(!user)
       {
         res.json('Invalid User') ;
         return Promise.reject({
           reason: 'LoginError',
            message: 'Incorrect username or Password'
         })
       }
      return user.validatePassword(req.body.password) ;
   }).then(isValid => {
      if(!isValid)
      {
        console.log('Invalid password');
        res.json('Invalid password') ;
      }
      else
       {
         const authToken = createAuthToken(req.body);
         res.json(authToken);
        }
   }).catch(err => {
     console.log(err);
     return res.status(err.code).json(err);
  })
});

const jwtAuth = passport.authenticate('jwt', {session: false});

// The user exchanges a valid JWT for a new one with a later expiration
router.post('/refresh', jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({authToken});
});

module.exports = {router};
