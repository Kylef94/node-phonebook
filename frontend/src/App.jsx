import { useEffect, useState } from 'react'
import ContactList from './components/ContactList.jsx'
import FilterForm from './components/FilterForm.jsx'
import PersonForm from './components/PersonForm.jsx'
import ContactService from './services/ContactService.js'
import Notification from './components/Notification.jsx'
import ErrorMessage from './components/ErrorMessage.jsx'


const App = () => {
  const [persons, setPersons] = useState([])
  const [search, setSearch] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    ContactService.getAll()
    .then(contacts => {
      setPersons(contacts)
    })
    
  }, [])

  const newContact = (newName, newNumber) => {
    const existingContact = persons.find(person => person.name == newName)
    if (existingContact) {
      updateNumber(existingContact, newNumber)
    }
    else {
      const newContact = {name: newName, 
                          number: newNumber}
      
      ContactService.create(newContact)
      .then(contact => {
        setPersons(persons.concat(contact))
        newNotification(`${contact.name} was added to the phonebook!`)
      })
      
    }
  }

  const removeContact = (contact) => {
    if (window.confirm(`Are you sure you want to delete ${contact.name}`)) {
      ContactService.remove(contact.id)
      .then(() =>{
        setPersons(persons.filter(person => person.id !== contact.id))
        newNotification(`${contact.name} was deleted from phonebook`)
      })
      .catch(error => {
        newErrorMessage(`${contact.name} was already removed from the server!`)
      })
    }
    else {
      newNotification(`${contact.name} not deleted`)
    }
  }

  const updateNumber = (contact, newNumber) => {
    if (window.confirm(`${contact.name} is already added to the phonebook, replace the old 
                        number with a new one?`)) {
      const updatedContact = {...contact, number: newNumber}
      ContactService.update(contact.id, updatedContact)
      .then(updatedPerson => {
        setPersons(persons.map(person => person.id === contact.id ? updatedPerson : person)
        
      )})
      .catch(error => {
        newErrorMessage(`${contact.name} was already removed from the server!`)
      })
    }
    else {
      newNotification(`${contact.name} was not updated!`)
    }
  }

  const newNotification = message => {
    setNotification(message)
        setTimeout(() => {
          setNotification(null)
        }, 5000)
  }

  const newErrorMessage = message => {
    setErrorMessage(message)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <ErrorMessage message={errorMessage}/>
      <Notification message={notification}/>
      <FilterForm search={search} setSearch={setSearch}/>
      <h3>Add new contact</h3>
      <PersonForm newContact={newContact}/>
      <h2>Numbers</h2>
      <ContactList persons={persons} search={search} removeContact={removeContact}/>
    </div>
  )
}

export default App
