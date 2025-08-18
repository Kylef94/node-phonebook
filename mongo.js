const mongoose = require('mongoose')
const process = require('node:process')

if (process.argv.length < 3) {
    console.log('please provide password as an argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstackapp:${password}@cluster0.25lc53k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    console.log('phonebook:')
    
    Person.find({}).then(result => {
        result.forEach(person => console.log(`${person.name} ${person.number}`))
        mongoose.connection.close()
        process.exit(0)
    })
    
}
else {
    const name = process.argv[3]
    const number = process.argv[4]
    const person = new Person({
        name: name,
        number: number
    })

    person.save().then(result =>{
        console.log(`added ${name} ${number} to phonebook`)
        mongoose.connection.close()
        process.exit(0)
    })
}