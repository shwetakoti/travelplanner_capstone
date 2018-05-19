'use strict';

exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://shweta:Archie123@ds011399.mlab.com:11399/restaurantsdb';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://shweta:Archie123@ds223760.mlab.com:23760/testrestaurantsdb';
exports.PORT = process.env.PORT || 8080;
//exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_SECRET = 'thinkful';
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '120d';
