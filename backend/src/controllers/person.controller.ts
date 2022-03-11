/**
 * Controller contains high-level operations using services, consumed by routes
 */
import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import personService from '../services/person.service';
import encounterService from '../services/encounter.service';
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

export const deletePerson = async (
  req: Request,
  res: Response,
  next: NextFunction,
  ): Promise<void> => {
    logger.info("DELETE /persons/:personID request from frontend");
  
    try {
      // Delete user from database
      await personService.deletePerson(req.params.personID);
      await encounterService.updateEncounters(req.params.personID);
      // Notify frontend that the operation was successful
      res.sendStatus(200);
    } catch(e) {

      next(e);
    }
  };
