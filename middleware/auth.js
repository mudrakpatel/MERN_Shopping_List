const config = require('config');
const jwt = require('jsonwebtoken');

const auth = (request, response, next) => {
  const token = request.header('x-auth-token');

  //Check for token
  if(!token){
    return response.status(401).json({
      message: 'No token, authorization denied!'
    });
  }else{
    try {
      //Verify token
      const decoded = jwt.verify(token, config.get('jwtSecret'));
      //Add user from payload
      request.user = decoded;
      next();
    } catch (e) {
      return response.status(400).json({
        message: 'Token is NOT valid!'
      });
    }
  }
};

module.exports = {
  auth
};
