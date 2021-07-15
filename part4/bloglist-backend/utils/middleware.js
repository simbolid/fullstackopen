const jwt = require('jsonwebtoken');
const logger = require('./logger');
const User = require('../models/user');

const tokenExtractor = (request, response, next) => {
  // authorization header format: "Bearer eyJhbGciOiJIUzI1NiIsInR5c2VybmFtZSI6Im1sdXVra2FpIiwiaW"
  const auth = request.get('authorization');

  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    request.token = auth.substring(7);
  } else {
    request.token = null;
  }

  next();
};

const userExtractor = async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET);

  // only allow logged-in users to perform actions
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }

  request.user = await User.findById(decodedToken.id);

  next();
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }
  if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'invalid token' });
  }

  next(error);
};

module.exports = {
  tokenExtractor,
  userExtractor,
  errorHandler,
};
