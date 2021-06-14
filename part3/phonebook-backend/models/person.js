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

// custom phone number validator
function numberValidator(number) {
  let digitCount = 0;

  for (let i = 0; i < number.length; i += 1) {
    if (number[i] >= '0' && number[i] <= '9') digitCount += 1;
  }

  return digitCount >= 8;
}

// define phonebook entry data
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minLength: 3,
  },
  number: {
    type: String,
    required: true,
    validate: [numberValidator, 'Phone number must contain at least 8 digits'],
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
