require('dotenv').config()
const mongoose = require('mongoose')

// check command line arguments 
if (process.argv.length === 3) {
  console.log("Usage: node mongo.js [name] [number]")
  console.log("Provide name along with number")
  process.exit(1)
}

// connect to MongoDB cluster
const url = process.env.DB_URI
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = new mongoose.model('Person', personSchema)

// if no entry given, display phonebook entries
if (process.argv.length === 2) {
  Person.find({}).then(result => {
    console.log('Phonebook:')
    result.forEach(person => { 
      console.log(`${person.name} ${person.number}`) 
    })
    mongoose.connection.close()
  })
}
// otherwise, add the given entry to the database
else {
  const person = new Person({
    name: process.argv[2],
    number: process.argv[3]
  })
  person.save().then(() => { 
    mongoose.connection.close(); 
  })
}