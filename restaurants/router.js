'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const jsonParser = bodyParser.json();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config');

const {restaurants,users} = require('../models');
const { JWT_SECRET } = require('../config');

const jwtAuth = passport.authenticate('jwt', {session: false});

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
// Post to register a new user
router.post('/', jsonParser,(req, res) => {
  console.log(req.body);
  const requiredFields = ['userName', 'password'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }

  const stringFields = ['userName', 'password','email','firstName', 'lastName'];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== 'string'
  );

  if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Incorrect field type: expected string',
      location: nonStringField
    });
  }

  // If the username and password aren't trimmed we give an error.  Users might
  // expect that these will work without trimming (i.e. they want the password
  // "foobar ", including the space at the end).  We need to reject such values
  // explicitly so the users know what's happening, rather than silently
  // trimming them and expecting the user to understand.
  // We'll silently trim the other fields, because they aren't credentials used
  // to log in, so it's less of a problem.
  const explicityTrimmedFields = ['userName', 'password'];
  const nonTrimmedField = explicityTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  );

  if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedField
    });
  }

//let {userName, password,email='',firstName = '', lastName = ''} = req.body;
let {firstName = '',lastName = '',userName,email = '', password} = req.body;
  // Username and password come in pre-trimmed, otherwise we throw an error
  // before this
  firstName = firstName.trim();
  lastName = lastName.trim();

  return users.find({userName})
    .count()
    .then(count => {
      if (count > 0) {
        // There is an existing user with the same username
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Username already taken',
          location: 'userName'
        });
      }
      // If there is no existing user, hash the password
      return users.hashPassword(password);
      console.log("In hashpassword:"+users.hashPassword(password));
    })
    .then(hash => {
      console.log("In just hash:"+userName);
      return users.create({
         user:{
            userName,
            password: hash,
            email,
            firstName,
            lastName
          }
      });
    })
    .then(user => {
      console.log("In user.serialize()"+ user.serialize());
      const authToken = createAuthToken(req.body);
      return res.status(201).json(authToken);
    })
    .catch(err => {
      // Forward validation errors on to the client, otherwise give a 500
      // error because something unexpected has happened
      if (err.reason === 'ValidationError') {
        console.log(err);
        return res.status(err.code).json(err);
      }
       console.log(err);
      res.status(500).json({code: 500, message: 'Internal server error'});
    });
});

// Never expose all your users like below in a prod application
// we're just doing this so we have a quick way to see
// if we're creating users. keep in mind, you can also
// verify this in the Mongo shell.
/*router.get('/', (req, res) =>
{
  return user.find()
    .then(users => res.json(users.map(user => user.serialize())))
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});*/

//restaurants endpoints
//GET request to get restaurantIds based on userId

//const jwtAuth = passport.authenticate('jwt', {session: false});


router.get('/viewfavorites/:userName',jsonParser,jwtAuth,(req,res) =>
{
   console.log("In viewFavorites:"+ req.params.userName);
   restaurants.findOne(
        {
          'userName' : req.params.userName
        }
      )
  .then(
    restaurant => res.status(200).json(restaurant))
  .catch(err => {
    console.log(err) ;
    res.status(500).json({ message: 'Something went wrong' })
  })
})

//POST request to post userId,username and restaurantIds
router.post('/favorites',jsonParser,(req,res) =>
{
  console.log(req.body);
  restaurants.create({
         userName: req.body.userName,
         city: req.body.city,
         locationType: req.body.locationType,
         restaurantInfo: req.body.restaurantInfo
      })
  //  .then(user => res.status(201).json(user.serialize()))
    .then(restaurant => res.status(201).json(restaurant.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong' });
    });
  })

//Update/Add restaurantIds
 router.put('/favorites/:id',jsonParser,(req,res) =>
  {
    console.log(req.params.id);
  /*  console.log(req.body.userId);
    if(!(req.params.id && req.body.userId && req.params.id === req.body.userId))
    {
      res.status(400).json({
        error: 'Request path id and request body id values must match'
      });
    }*/

   const updateRestaurantIds = [];
    for(let i=0;i<req.body.restaurantInfo.length;i++)
    {
      updateRestaurantIds.push(req.body.restaurantInfo[i]);
    }
     console.log(updateRestaurantIds);
     restaurants
    .replaceOne( {userName:req.body.userName},
                 { userName:req.body.userName,
                   city: req.body.city,
                  locationType: req.body.locationType,
                  restaurantInfo:updateRestaurantIds } )
    .then(updatedRestaurant => res.status(204).end())
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Something went wrong' })
    });
  })

/*  router.delete('/:id', (req, res) => {
    restaurants
      .findByIdAndRemove(req.params.id)
      .then(() => {
        console.log(`Deleted object with id \`${req.params.id}\``);
        res.status(204).end();
      });
  });*/


  router.use('*', function (req, res) {
    res.status(404).json({ message: 'Not Found' });
  });

  // closeServer needs access to a server object, but that only
  // gets created when `runServer` runs, so we declare `server` here
  // and then assign a value to it in run
  let server;

  // this function connects to our database, then starts the server
  function runServer(databaseUrl, port = PORT) {
    return new Promise((resolve, reject) => {
      mongoose.connect(databaseUrl, err => {
        if (err) {
          return reject(err);
        }
        server = app.listen(port, () => {
          console.log(`Your app is listening on port ${port}`);
          resolve();
        })
          .on('error', err => {
            mongoose.disconnect();
            reject(err);
          });
      });
    });
  }

  // this function closes the server, and returns a promise. we'll
  // use it in our integration tests later.
  function closeServer() {
    return mongoose.disconnect().then(() => {
      return new Promise((resolve, reject) => {
        console.log('Closing server');
        server.close(err => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      });
    });
  }


if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { runServer, router, closeServer };
