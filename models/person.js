const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log("Connecting to DB", url)
mongoose.connect(url)
    .then(result => {
        console.log("MongoDB connection established")
    })
    .catch(error => {
        console.log("Error connecting to MongoDB", error.message);
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: [true, "Contact name is required"]
    },
    number: {
        type: String,
        minLength: 8,
        validate: {
            validator: (v) => {return /\d{2,3}-\d{5,8}/.test(v)},
            message: props => `${props.value} is not a valid phone number!`
        },
        required: [true, "Contact phone number is required"]
    }
})

personSchema.set('toJSON', {
    transform: (doc, returnedObj) => {
        returnedObj.id = returnedObj._id.toString()
        delete returnedObj._id
        delete returnedObj.__v
    }
})

module.exports = mongoose.model('Person', personSchema)
