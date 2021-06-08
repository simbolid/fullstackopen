require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.DB_URI

// connect to MongoDB
console.log('connecting to', url)
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

// define phonebook entry data
const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

// make ID field a string rather than an object; remove unncessary fields 
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v 
  }
})

module.exports = mongoose.model('Person', personSchema)