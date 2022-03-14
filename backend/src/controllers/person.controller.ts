/**
 * Controller contains high-level operations using services, consumed by routes
 */
import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import personService from '../services/person.service';
import encounterService from '../services/encounter.service';
import userService from '../services/user.service';

import logger from '../utils/logger';
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

export const deletePersons = async (
  req: Request,
  res: Response,
  next: NextFunction,
  ): Promise<void> => {
    logger.info("DELETE /persons/:personID request from frontend");
    const auth_id = req.headers.authorization?.["user_id"];
    
    const current_user = await userService.getUserByAuthId(auth_id);
    const user_id = req.params.id;

    const user_persons = current_user?.persons;
    let string_persons = user_persons?.map(x => x.toString());

    if (string_persons?.includes(user_id.toString())) {
      try {
        // Delete user from database
        await personService.deletePersons(req.params.id);

        // return encounters that may have empty persons fields
        const empty_encounters = await encounterService.deleteEmptyEncounters(req.params.id);
        await userService.deleteUserPerson(req.params.id);

        // Make sure that empty encounters are also deleted from User
        for (let i = 0; i < empty_encounters.length; i++) {
          await userService.deleteUserEncounter(empty_encounters[i]?._id.toString());
        }
        
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
