/**
 * Route configures endpoints, and attaches controller as an action to each route's REST methods
 */
import { Router } from 'express';
import { createPerson, getAllPeople, deletePersons } from '../controllers/person.controller';

const routes = Router();

routes.post('/', createPerson)
      .get('/', getAllPeople)
      .delete('/:id', deletePersons);

export default routes;
