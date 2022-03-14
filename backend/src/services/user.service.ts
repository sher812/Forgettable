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

export const deleteUserEncounter = async (encounterId : string) => {
  await User.updateMany({}, { $pullAll: {encounters: [{ _id: encounterId}]} });
};

const userService = {
    createUser,
    getUserByAuthId,
    deleteUserEncounter
  }

export default userService;