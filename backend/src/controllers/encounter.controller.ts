/**
 * Controller contains high-level operations using services, consumed by routes
 */
 import { NextFunction, Request, Response } from 'express';
 import logger from '../utils/logger';
 import httpStatus from 'http-status';
 import FirebaseAdmin from '../firebase-configs/firebase-config';
 
 import EncounterModel from '../models/encounter.model';
 import encounterService from '../services/encounter.service';
 import userService from '../services/user.service';
 import personService from '../services/person.service';

 
 export const createEncounter = async (
   req: Request,
   res: Response,
   next: NextFunction,
 ): Promise<void> => {
   logger.info("POST /encounter/create request from frontend");
 
   try {
     // Grab the data from the req
     const encounterReq = getEncounterFromReqBody(req.body);
 
     // Pass data to service and attempt to save
     const createdEncounter = await encounterService.createEncounter(encounterReq);
 
     // Notify frontend that the operation was successful
     res.sendStatus(200);
   } catch (e) {
     next(e);
   }
 };

 export const deleteEncounters = async (
  req: Request,
  res: Response,
  next: NextFunction,
  ): Promise<void> => {
    logger.info("DELETE /encounters/:encounterID request from frontend");
    const auth_id = req.headers.authorization?.["user_id"];
    
    const user_current = await userService.getUserByAuthId(auth_id);
    const id = req.params.encounterID;
    const encounters_delete = user_current?.encounters;
    let string_encounters = encounters_delete?.map(x => x.toString());

    if (string_encounters?.includes(id.toString())) {
      try {
        // Delete user from database
        await encounterService.deleteEncounters(req.params.encounterID);
        await personService.updatePersons(req.params.encounterID);
        await userService.deleteUserEncounter(req.params.encounterID);
        

        // Notify frontend that the operation was successful
        res.sendStatus(httpStatus.OK).end();
      } catch(e) {
  
        next(e);
      }
    } else {
      res.sendStatus(httpStatus.NOT_FOUND).end();
    }
    
    res.status(httpStatus.OK).end();
  };
 
 // Util function that won't be needed regularly
const getEncounterFromReqBody = (body: any) => {
    const encounter = {
        date: body.date,
        location: body.location,
        description: body.description,
        persons: body.persons
    }

   return encounter;
 }