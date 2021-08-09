const express = require('express');
require('express-async-errors');
const cors = require('cors');
const mongoose = require('mongoose');
const blogRouter = require('./controllers/blogs');
const loginRouter = require('./controllers/login');
const userRouter = require('./controllers/users');
const testingRouter = require('./controllers/testing');
const config = require('./utils/config');
const logger = require('./utils/logger');
const middleware = require('./utils/middleware');

const app = express();

// connect to MongoDB
logger.info('connecting to MongoDB');
mongoose.connect(config.MONGODB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => logger.info('connected to MongoDB'))
  .catch((error) => logger.error('error connecting to MongoDB:', error.message));

// allow requests from any origin
app.use(cors());

// parse requests with JSON payloads
app.use(express.json());

// route handling
if (process.env.NODE_ENV === 'test') {
  app.use('/api/testing', testingRouter);
}
app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);

// requests to this endpoint will have token and user properties
app.use('/api/blogs', middleware.tokenExtractor, middleware.userExtractor, blogRouter);

app.use(middleware.errorHandler);

module.exports = app;
