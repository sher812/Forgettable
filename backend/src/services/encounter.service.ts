import Encounter, {EncounterModel} from '../models/encounter.model';

export const createEncounter = async (encounterDetails: EncounterModel) => {
    const encounter = new Encounter(encounterDetails);
    await encounter.save();
    return encounter;
};

export const getEncounters = async () => Encounter.find(() => true).clone();

export const updateEncounters = async (personID: string) => {
    await Encounter.updateMany({ }, { $pullAll: {persons: [{ _id: personID}]} });

    // Required to delete empty encounters in User
    const empty_encounters = await Encounter.find({persons : {$exists:true, $size:0}});

    await Encounter.deleteMany({persons: {$exists: true, $size: 0}});

    return empty_encounters;
}

const encounterService = {
    createEncounter,
    getEncounters,
    updateEncounters
  }

export default encounterService;