const Person = ({person, removeContact}) => <p>{person.name} {person.number} <button onClick={() => removeContact(person)}>Delete</button></p>

const ContactList = ({persons, search, removeContact}) => {
  const filterByName = () => persons.filter((person) => person.name.toLowerCase().includes(search.toLowerCase()))
  
  return (filterByName().map((person) => <Person key={person.name} person={person} removeContact={removeContact} />))
}

export default ContactList