import User, {UserModel} from '../models/user.model';

export const createUser = async (userDetails: UserModel) => {
    const user = new User(userDetails);
    await user.save();
    return user;
};

export const getUserByAuthId = async (userId) => {
  const user = await User.findOne({ auth_id: userId });
  return user;
};

export const deleteUserPerson = async (personID: String) => {
  await User.updateMany({ }, { $pullAll: {persons: [{ _id: personID}]}});
}

export const deleteUserEncounter = async (encounterID: String) => {
  await User.updateMany({ }, { $pullAll: {encounters: [{ _id: encounterID}]}})
}

const userService = {
    createUser,
    getUserByAuthId,
    deleteUserPerson,
    deleteUserEncounter
  }

export default userService;