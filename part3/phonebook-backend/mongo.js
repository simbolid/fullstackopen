const mongoose = require('mongoose');

// check command line arguments 
if (process.argv.length < 3 || process.argv.length === 4) {
  console.log("Usage: node mongo.js [password] [name] [number]");
  process.exit(1);
}

// connect to MongoDB cluster
const password = process.argv[2];
const url = `mongodb+srv://fullstack:${password}@cluster0.9kcqq.mongodb.net/note-app?retryWrites=true&w=majority`;
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true });

const personSchema = new mongoose.Schema({
  name: String,
  number: String
});

const Person = new mongoose.model('Person', personSchema);

// if only password provided, display phonebook entries
if (process.argv.length === 3) {
  Person.find({}).then(result => {
    console.log('Phonebook:')
    result.forEach(person => { 
      console.log(`${person.name} ${person.number}`); 
    });
    mongoose.connection.close();
  });
}
// otherwise, add the given entry to the database
else {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  });
  person.save().then(() => { 
    mongoose.connection.close(); 
  });
}