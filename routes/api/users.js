const express = require('express');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');

const router = express.Router();

//User model
const User = require('../../models/User');

//@route    POST api/users
//@desc     Register new user
//@access   Public
router.post('/', (request, response, next) => {
  const {name, email, password} = request.body;

  //Simple validation
  if(!name || !email || !password){
    return response.status(400).json({message: 'Please enter all fields!'});
  }

  //Check for existing user
  User
  .findOne({
    email: email
  })
  .then(user => {
    if(user){
      return response.status(400).json({message: 'User already registered!'});
    } else {
      const newUser = new User({
        name: name,
        email: email,
        password: password
      });
      //Create salt and hash
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if(err){
            throw err;
          }else{
            newUser.password = hash;
            newUser.save()
              .then(user => {
                jwt.sign({
                  _id: user._id
                }, config.get('jwtSecret'), {
                  expiresIn: 3600
                }, (err, token) => {
                  if(err){
                    throw err;
                  }
                    return response.status(201).json({
                      user: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                      },
                      token: token
                    });
                });
              });
          }
        });
      });
    }
  });
});


module.exports = router;
