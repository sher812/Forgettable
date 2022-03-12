/**
 * Controller contains high-level operations using services, consumed by routes
 */
 import { NextFunction, Request, Response } from 'express';

 import personService from '../services/person.service';
 import encounterService from '../services/encounter.service';
 import userService from '../services/user.service';
 import logger from '../utils/logger';

 import FirebaseAdmin from '../firebase-configs/firebase-config';
 import httpStatus from 'http-status';
 
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

 export const getAllEncounters = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    logger.info('GET /persons request from frontend');
  
    try {
      const encounters = await encounterService.getEncounters();
      res.send(encounters);
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
    try {
      if (!req.headers.authorization) {
        logger.info("No authorization header");
        res.status(httpStatus.UNAUTHORIZED).end();
      } else {
        const idToken = req.headers.authorization;
        let auth_id;
  
        await FirebaseAdmin.auth()
          .verifyIdToken(idToken)
          .then((decodedToken) => {
            auth_id = decodedToken.uid;
            logger.info(`Verified User: #${auth_id}`);
          })
          .catch((error) => {
            logger.info("caught unauthorized");
            res.status(httpStatus.UNAUTHORIZED).end();
          });
  
        // Perform DB logic using retrieved auth_id below
        const user_current = await userService.getUserByAuthId(auth_id);
        const id = req.params.encounterID;
        const encounters_delete = user_current?.encounters;
        let string_encounters = encounters_delete?.map(x => x.toString());

        if (string_encounters?.includes(id.toString())) {
          try {
            // Delete user from database
            await encounterService.deleteEncounters(req.params.encounterID);
            await personService.updatePersons(req.params.encounterID);
            // Notify frontend that the operation was successful
            res.sendStatus(httpStatus.OK).end();
          } catch(e) {
      
            next(e);
          }
        } else {
          res.sendStatus(httpStatus.NOT_FOUND).end();
        }
        res.status(httpStatus.OK).end();
      }
    } catch (e) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).end();
    }
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