import mongoose from 'mongoose';
import Encounter, {EncounterModel} from '../models/encounter.model';


export const createEncounter = async (encounterDetails: EncounterModel) => {
    const encounter = new Encounter(encounterDetails);
    await encounter.save();
    return encounter;
};

export const getEncounters = async () => Encounter.find(() => true).clone();

export const updateEncounters = async (personID: string) => {
    await Encounter.updateMany({ }, { $pullAll: {persons: [{ _id: personID}]} });
    await Encounter.deleteMany({persons: {$exists: true, $size: 0}});
}

const encounterService = {
    createEncounter,
    getEncounters,
    updateEncounters
  }

export default encounterService;