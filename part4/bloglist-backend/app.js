const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const blogRouter = require('./controllers/blogs');
const userRouter = require('./controllers/users');
const config = require('./utils/config');
const logger = require('./utils/logger');

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
app.use('/api/users', userRouter);
app.use('/api/blogs', blogRouter);

module.exports = app;
