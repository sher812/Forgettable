/**
 * Service contains database operations
 */
import Person, { PersonModel } from '../models/person.model';

const createPerson = async (personDetails: PersonModel) => {
  const person = new Person(personDetails);
  await person.save();
  return person;
};

/**
 * Note that .clone is necessary to avoid error 'Query was already executed'
 * Refer to section 'Duplicate Query Execution under https://mongoosejs.com/docs/migrating_to_6.html
 */
const getPeople = async () => Person.find(() => true).clone();

const deletePersons = async (personID: string) => {
  await Person.deleteOne({_id: personID});
}

const personService = {
  createPerson,
  getPeople,
  deletePersons
};

export default personService;
