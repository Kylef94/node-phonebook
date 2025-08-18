const express = require('express')
const morgan = require('morgan')

//get env vars
require('dotenv').config()

const app = express()
app.use(express.json())

//set up DB and models
const Person = require('./models/person')

//set up logging
morgan.token('body', function (req) { return JSON.stringify(req.body) })

app.use(morgan('tiny', {
  skip: function (req, res) {return res.method != 'POST'}
}))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms - :body', {
  skip: function (req, res) {return res.method === 'POST'}
}))

// app routes

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(persons => response.json(persons))
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id

  Person.findById(id)
    .then(person => response.json(person))
    .catch(error => next(error))
})
 
app.get('/info', (request, response, next) => {
  const now = new Date().toString()

  Person.countDocuments({})
    .then(count => response.send(
      `<p>Phonebook has info for ${count} people </p>
      <p>${now}<p>`))
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  
  Person.findByIdAndDelete(id)
    .then(() => response.status(204).end())
    .catch(error => next(error))
})


app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body) {
    response.status(204).send({error: 'no body found'})
  }
  const { name, number } = request.body
  
  const newPerson = new Person({
    name: name,
    number: number
  })

  newPerson.save()
    .then(result => response.status(200).json(result))
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const id = request.params.id

  if (!body) {
    response.status(204).send({error: 'no body found'})
  }
  const { name, number } = request.body
  
  Person.findById(id)
    .then(person => {
      if (!person) {
        return response.status(404).end()
      }

      person.name = name
      person.number = number

      return person.save()
        .then(updatedPerson => response.json(updatedPerson))
        .catch(error => next(error))
    })
    .catch(error => next(error))    
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'Unknown endpoint'})
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(404).send({error: 'malformatted id'})
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({error: error.message})
  }

  next(error)
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
