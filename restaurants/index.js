'use strict';
//const {users} = require('../models');
const {restaurants,users} = require('../models');
//console.log(restaurants);
const {router} = require('./router');
const {localStrategy, jwtStrategy} = require('../auth/strategies');

module.exports = {users, restaurants,router,localStrategy,jwtStrategy}
