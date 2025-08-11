const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

app.use(morgan('tiny', {
  skip: function (req, res) {return res.method != "POST"}
}));

app.use(morgan(':method :url :status :res[content-length] - :response-time ms - :body', {
  skip: function (req, res) {return res.method === "POST"}
}));

app.use(express.static('dist'))

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.filter(person => person.id === id)

    if (person.length === 1) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.get('/info', (request, response) => {
    const now = new Date().toString()
    response.send(`<p>Phonebook has info for ${contacts.length} people </p>
        <p>${now}<p>`)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.filter(person => person.id === id)

    if (person.length === 1) {
      persons = persons.filter(person => person.id != id)
      response.status(204).end()
    } 
    else {
      response.status(404).end()
    }
})

const generateId = () => String(Math.floor(Math.random() * 1000))

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body) {
    response.status(204).send({error: "no body found"})
  }

  console.log('request body:', body)
  const name = request.body.name
  const number = request.body.number 
  
  if (persons.filter(person => person.name === name).length === 1) {
    response.json({error: "This name already exists in the phonebook"})
  }
  else if (persons.filter(person => person.number === number).length === 1) {
    response.json({error: "This number already exists in the phonebook"})
  }
  else {
    const newPerson = {
      id: generateId(),
      name: name,
      number: number
    }

    console.log(`creating new person ${newPerson.name}, id: ${newPerson.id} number: ${newPerson.number}`)

    persons = persons.concat(newPerson)
    response.status(200).json(newPerson)
    }
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})
