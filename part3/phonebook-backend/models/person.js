require('dotenv').config();
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const url = process.env.DB_URI;

// connect to MongoDB
console.log('connecting to', url);
mongoose.connect(url,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
  });

// define phonebook entry data
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  number: {
    type: String,
    required: true,
  },
});

// apply the uniqueValidator plugin to the schema
personSchema.plugin(uniqueValidator);

// make ID field a string rather than an object; remove unncessary fields
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Person', personSchema);
