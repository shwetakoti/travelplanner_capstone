'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
//const faker = require('faker');
const mongoose = require('mongoose');

// this makes the expect syntax available throughout
// this module
const expect = chai.expect;

const {users,restaurants} = require('../models');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

let userName;

chai.use(chaiHttp);

// used to put randomish documents in db
// so we have data to work with and assert about
// and then we insert that data into mongo
function seedRestaurantData() {
  console.info('seeding restaurant data');
  const seedData = [];

  for (let i=1; i<=10; i++) {
    seedData.push(generateRestaurantData());
  }
  // this will return a promise
  return restaurants.insertMany(seedData);
}

// used to generate data to put in db
function generateUserName() {

  const userNames = [
    'aandrews', 'bcooper', 'vlodge', 'jjones', 'skoti'];
     userName = userNames[0];

  return userNames[Math.floor(Math.random() * userNames.length)];
}

// used to generate data to put in db
function generateCity() {
  const city = ['Seattle','San Francisco','London','New York'];
  return city[Math.floor(Math.random() * city.length)];
}

function generateLocationType(){
  const location = ['city','group']
  return location[Math.floor(Math.random()* location.length)];
}
// used to generate data to put in db

function generateRestaurantInfo(){
  const restaurantInfo = [{'resId' : '123456',
  'resName' : 'Pink Door',
  'resThumb' : 'image1',
  'resCuisines' : 'cuisine1',
  'resRating': 'rating1',
  'resRatingText': 'Good',
  'resUrl' : 'test URL1'},
  {'resId': '678910',
  'resName' : 'Wild Ginger',
  'resUrl' : 'test URL2',
  'resThumb' : 'image2',
  'resCuisines' : 'cuisine2',
  'resRating': 'rating2',
  'resRatingText': 'Excellent'}]

  return restaurantInfo[Math.floor(Math.random()* restaurantInfo.length)];
}

// generate an object represnting a restaurant.
// can be used to generate seed data for db
// or request.body data

function generateRestaurantData() {
return {
    userName : generateUserName(),
    restaurantInfo : generateRestaurantInfo(),
 }
}

// this function deletes the entire database.
// we'll call it in an `afterEach` block below
// to ensure data from one test does not stick
// around for next one
function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}

describe('Restaurants API resource', function() {

  // we need each of these hook functions to return a promise
  // otherwise we'd need to call a `done` callback. `runServer`,
  // `seedRestaurantData` and `tearDownDb` each return a promise,
  // so we return the value returned by these function calls.
  before(function(){
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function(){
    return seedRestaurantData();
  });


  after(function(){
    return closeServer();
  });



  describe('POST endpoint', function() {
    // strategy: make a POST request with data,
    // then prove that the restaurant we get back has
    // right keys, and that `id` is there (which means
    // the data was inserted into db)
    it('should add a new restaurant', function() {

      const newRestaurant = generateRestaurantData();
       return chai.request(app)
        .post('/restaurants/favorites')
        .send(newRestaurant)
        .then(function(res) {
         expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body.userName).to.equal(newRestaurant.userName);
          // cause Mongo should have created id on insertion
          expect(res.body.id).to.not.be.null;
          //expect(res.body.city).to.equal(newRestaurant.city);
        //  expect(res.body.locationType).to.equal(newRestaurant.locationType);
        })
     });
  });

  describe('GET endpoint', function() {

    it('should return all favorites', function() {
     const newRestaurant = generateRestaurantData();
     return chai.request(app)
      .post('/restaurants/favorites')
      .send(newRestaurant);

      return chai.request(app)
      .get('/restaurants/viewFavorites/'+ `${userName}`)
      .then(function(res) {
       expect(res).to.have.status(200);
       expect(res).to.be.json;
       expect(res.body).to.be.a('array');
       expect(res.body.length).to.be.above(0);
        res.body.forEach(function(item) {
          expect(item).to.be.a('object');
          expect(item).to.have.all.keys(
            'userName', 'city', 'locationType', 'restaurantInfo')
          });
        });
      });
    });



  describe('PUT endpoint', function() {

    // strategy:
    //  1. Get an existing restaurant from db
    //  2. Make a PUT request to update that restaurant
    //  3. Prove restaurant returned by request contains data we sent
    //  4. Prove restaurant in db is correctly updated
    it('should update favorites on PUT', function() {
      return chai.request(app)
      // first have to get
      console.log(userNames[0])
      .get('/restaurants/viewFavorites/'+ `${userName}`)
      .then(function( res) {
        const updatedPost = Object.assign(res.body[0], {
          resName: 'testrestaurant',
          resUrl: 'testUrl100'
        });
        return chai.request(app)
          .put('/restaurants/favorites/'+`${userName}`)
          .send(updatedPost)
          .then(function(res) {
            expect(res).to.have.status(204);
          });
      });
    });
  });
});
