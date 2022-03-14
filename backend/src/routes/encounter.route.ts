/**
 * Route configures endpoints, and attaches controller as an action to each route's REST methods
 */
 import { Router } from 'express';
 import { createEncounter, deleteEncounters } from '../controllers/encounter.controller';
 
 const routes = Router();
 
 routes.post('/', createEncounter)
        .delete('/:encounterID', deleteEncounters);
 
 export default routes;
 