import model from "./model.js";

// Create User
export const createUser = async (user) => {
  delete user._id;
  const newUser = await model.create(user);
  console.log("User created:", newUser);
  return newUser;
};

// Find All Users
export const findAllUsers = async () => {
  const users = await model.find();
  console.log("All users:", users);
  return users;
};

// Find User by ID
export const findUserById = async (userId) => {
  const data = await model.findById(userId);
  console.log("User found by ID:", data);
  return data;
};

// Find User by Username
export const findUserByUsername = async (username) => {
  const user = await model.findOne({ username });
  console.log("User found by username:", user);
  return user;
};

// Find User by Credentials
export const findUserByCredentials = async (username, password) => {
  const user = await model.findOne({ username, password });
  console.log("User found by credentials:", user);
  return user;
};

// Update User
export const updateUser = async (userId, user) => {
  const result = await model.updateOne({ _id: userId }, { $set: user });
  console.log(`User ${userId} update result:`, result);
  return result;
};

// Delete User
export const deleteUser = async (userId) => {
  const result = await model.deleteOne({ _id: userId });
  console.log(`User ${userId} delete result:`, result);
  return result;
};

// Find Users by Role
export const findUsersByRole = async (role) => {
  const users = await model.find({ role });
  console.log(`Users found with role "${role}":`, users);
  return users;
};

// Find Users by Partial Name
export const findUsersByPartialName = async (partialName) => {
  const regex = new RegExp(partialName, "i");
  const users = await model.find({
    $or: [
      { firstName: { $regex: regex } },
      { lastName: { $regex: regex } },
    ],
  });
  console.log(`Users matching partial name "${partialName}":`, users);
  return users;
};
