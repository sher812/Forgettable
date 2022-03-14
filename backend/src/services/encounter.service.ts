import Encounter, {EncounterModel} from '../models/encounter.model';

export const createEncounter = async (encounterDetails: EncounterModel) => {
    const encounter = new Encounter(encounterDetails);
    await encounter.save();
    return encounter;
};

export const getEncounters = async () => Encounter.find(() => true).clone();

export const deleteEmptyEncounters = async (personID: string) => {
    // Service is used for deletePersons endpoint

    await Encounter.updateMany({ }, { $pullAll: {persons: [{ _id: personID}]} });
    const empty_encounters = await Encounter.find({persons : {$exists:true, $size:0}});
    await Encounter.deleteMany({persons: {$exists: true, $size: 0}});

    // return encounters that may have empty persons fields
    return empty_encounters;
}

const encounterService = {
    createEncounter,
    getEncounters,
    deleteEmptyEncounters
  }

export default encounterService;