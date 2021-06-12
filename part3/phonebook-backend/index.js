require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const Person = require('./models/person');

const app = express();

// upon receiving GET request, check if build directory contains a file
// corresponding to request address
app.use(express.static('build'));

// parse requests containing JSON payloads
app.use(express.json());

// HTTP request logging
morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

// retrieve all entries
app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then((people) => response.json(people))
    .catch((error) => next(error));
});

// retrieve single entry
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) response.json(person);
      else response.status(404).end();
    })
    .catch((error) => next(error));
});

// retrieve phonebook info: number of people, datetime
app.get('/info', (request, response, next) => {
  Person.count({}, (err, count) => {
    response.send(`<p>Phonebook has info for ${count} people</p> ${new Date()}`);
  })
    .catch((error) => next(error));
});

// delete an entry
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((person) => {
      if (person) response.json(person);
      else response.status(404).end();
    })
    .catch((error) => next(error));
});

// add an entry
app.post('/api/persons', (request, response, next) => {
  if (!request.body.name || !request.body.number) {
    // 400 bad request
    return response.status(400).json({
      error: 'data must include both name and number',
    });
  }

  const person = new Person({
    name: request.body.name,
    number: request.body.number,
  });

  person.save()
    .then((savedPerson) => response.json(savedPerson))
    .catch((error) => next(error));
});

// update an entry
app.put('/api/persons/:id', (request, response, next) => {
  const update = { number: request.body.number };

  // new option: return updated note
  Person.findByIdAndUpdate(request.params.id, update, { new: true })
    .then((savedPerson) => response.json(savedPerson))
    .catch((error) => next(error));
});

// see https://mongoosejs.com/docs/api/error.html for mongoose error types
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    // 400 bad request
    return response.status(400).send({ error: 'malformatted id' });
  }

  // call express' default error handler
  next(error);
};

app.use(errorHandler);

const { PORT } = process.env;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
