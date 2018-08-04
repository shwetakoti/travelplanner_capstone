'use strict';

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const userSchema = mongoose.Schema
({
  user:
  {
    firstName: String,
    lastName:  String,
    userName: String,
     email:     String,
  //  password: {type: String, required:true}
    password: String
  },
  created: {type: Date, default: Date.now}
});

const restaurantSchema = mongoose.Schema
({

    userName:String,
    restaurantInfo: Array,
    created: {type: Date, default: Date.now}

})

userSchema.methods.serialize = function() {
  return{
       userName : this.user.userName ,
       firstName : this.user.firstName ,
       lastName: this.user.lastName
  }
}

restaurantSchema.methods.serialize = function()
{
  return{
      userName : this.userName,
      restaurantInfo : this.restaurantInfo
    }
}

userSchema.methods.validatePassword = function(password) {
  console.log('In models.js:'+password);
  return bcrypt.compare(password, this.user.password);
};

userSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

const restaurants = mongoose.model('restaurants', restaurantSchema);
const users = mongoose.model('users',userSchema);

module.exports = {restaurants,users};
