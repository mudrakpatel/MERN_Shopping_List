const express = require('express');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth').auth;

const router = express.Router();

//User model
const User = require('../../models/User');

//@route    POST api/auth
//@desc     Authenticate the user
//@access   Public
router.post('/', (request, response, next) => {
  const {email, password} = request.body;

  //Simple validation
  if(!email || !password){
    return response.status(400).json({message: 'Please enter all fields!'});
  }

  //Check for existing user
  User
  .findOne({
    email: email
  })
  .then(user => {
    if(!user){
      return response.status(400).json({message: 'User not registered!'});
    } else {
      //Validate password
      bcrypt.compare(password, user.password)
            .then(isMatch => {
              if(!isMatch){
                return response.status(400).json({
                  message: "Invalid credentials!"
                });
              }else{
                jwt.sign({
                  _id: user._id
                }, config.get('jwtSecret'), {
                  expiresIn: 3600
                }, (err, token) => {
                  if(err){
                    throw err;
                  }
                    return response.status(200).json({
                      user: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                      },
                      token: token
                    });
                });
              }
            });
    }
  });
});

//@route    GET api/auth/user
//@desc     Get user data
//@access   Private
router.get('/user', auth, (request, response, next) => {
  User.findById(request.user._id)
      .select('-password') //Do not return password
      .then(user => {
        return response.status(200).json({user: user});
      });
});


module.exports = router;
