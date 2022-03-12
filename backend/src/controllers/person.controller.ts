/**
 * Controller contains high-level operations using services, consumed by routes
 */
import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import personService from '../services/person.service';
import encounterService from '../services/encounter.service';
import userService from '../services/user.service';

import logger from '../utils/logger';

import FirebaseAdmin from '../firebase-configs/firebase-config';
import { POST } from './controller.types';

export const createPerson: POST = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  logger.info('POST /persons/create request from frontend');

  try {
    const person = await personService.createPerson(req.body);
    res.status(httpStatus.CREATED).send(person);
  } catch (e) {
    next(e);
  }
};

export const getAllPeople = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  logger.info('GET /persons request from frontend');

  try {
    const people = await personService.getPeople();
    res.status(httpStatus.OK).json(people);
  } catch (e) {
    next(e);
  }
};

export const deletePerson = async (
  req: Request,
  res: Response,
  next: NextFunction,
  ): Promise<void> => {
    logger.info("DELETE /persons/:personID request from frontend");
  
    try {
      if (!req.headers.authorization) {
        logger.info("No authorization header");
        res.status(httpStatus.UNAUTHORIZED).end();
      } else {
        const idToken = req.headers.authorization;
        let auth_id;
        console.log("ID TOKEN", idToken);
  
        await FirebaseAdmin.auth()
          .verifyIdToken(idToken)
          .then((decodedToken) => {
            auth_id = decodedToken.uid;
            logger.info(`Verified User: #${auth_id}`);
          })
          .catch((error) => {
            logger.info("caught unauthorized", error);
            res.status(httpStatus.UNAUTHORIZED).end();
          });
  
        // Check person id exists in User's persons array
        // const user = await userService.getUser(auth_id);
        const id = req.params.personID;
        // const persons = user.persons;

        // if (persons.includes(id)) {
        //   try {
        //     // Delete user from database
        //     await personService.deletePerson(req.params.personID);
        //     await encounterService.updateEncounters(req.params.personID);
        //     // Notify frontend that the operation was successful
        //     res.sendStatus(200);
        //   } catch(e) {
      
        //     next(e);
        //   }
        // } else {
        //   res.status(httpStatus.NOT_FOUND);
        // }
        console.log(auth_id);
      }
    } catch (e) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).end();
    }
    
  };
