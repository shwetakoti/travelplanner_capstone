'use strict';
const {router} = require('./router');
const {localStrategy, jwtStrategy} = require('./strategies');
//const {router,localStrategy, jwtStrategy} = require('./router');

module.exports = {router,localStrategy,jwtStrategy};
