var jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }
  const token = authHeader.split(' ')[1];
  if (!token || token === '') {
    req.isAuth = false;
    return next();
  }
  let decodedToken;
  try {
    // here we pass same secret key that we pass at the time of creation of token
    decodedToken = jwt.verify(token, 'alihaider12345678');
    console.log('decodedToken : ', decodedToken);
  } catch (error) {
    console.log('Error : ', error);
    req.isAuth = false;
    return next();
  }
  if (!decodedToken) {
    req.isAuth = false;
    return next();
  }
  req.isAuth = true;
  req.userId = decodedToken.userId;
  next();
};
