/**
 * Controller contains high-level operations using services, consumed by routes
 */
 import { NextFunction, Request, Response } from 'express';
 import encounterService from '../services/encounter.service';
 import logger from '../utils/logger';
import httpStatus from "http-status";
import {EncounterModel} from "../models/encounter.model";
import {getUserByAuthId} from "../services/user.service";
 
 export const createEncounter = async (
   req: Request,
   res: Response,
   next: NextFunction,
 ): Promise<void> => {
   logger.info("POST /encounter request from frontend");
 
   try {
     // Pass data to service and attempt to save
     const createdEncounter = await encounterService.createEncounter(req.body);
     // Notify frontend that the operation was successful
     res.status(httpStatus.CREATED).json(createdEncounter).end();
   } catch (e) {
     next(e);
   }
 };
export const updateEncounter = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<any> => {
    logger.info("PUT /encounter/:id request from frontend");

    try {
        // check authorization is not a null object (this is necessary check for lint)
        if (req.headers.authorization == null)
            return res.status(httpStatus.NOT_FOUND).end()

        const encounterIdToUpdate = req.params.id
        const firebaseAuthId = req.headers.authorization['user_id']

        // check that user exists with that firebase auth_id, and the user specified encounter actually exists
        const userByAuthId = await getUserByAuthId(firebaseAuthId);
        if(!userByAuthId || !isEncounterExistsInUser(userByAuthId, encounterIdToUpdate))
            return res.status(httpStatus.NOT_FOUND).end()

        // update encounter
        const updatedEncounter = await encounterService.updateEncounter(encounterIdToUpdate, req.body);
        return res.sendStatus(updatedEncounter?httpStatus.NO_CONTENT:httpStatus.NOT_FOUND).end();
    } catch (e) {
        next(e);
    }
};

/**
 * searches for encounter in user by encounter id
 * @param user user which encounter should be found from
 * @param encounterId id of the encounter to be searched from the user
 */
const isEncounterExistsInUser = (user, encounterId: string): boolean => {
    const findEncounter = user.encounters.filter(e=>e.toString() === encounterId)
    return findEncounter.length!==0
}