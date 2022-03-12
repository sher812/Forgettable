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

const userService = {
    createUser,
    getUserByAuthId
  }

export default userService;