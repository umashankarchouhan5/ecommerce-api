const { StatusCodes } = require("http-status-codes");
const User = require("../models/user");
const CustomError = require("../errors");
const { attachCookieToResponse, checkPermission } = require("../utils");

const getSingleUser = async (req, res) => {
  console.log(req.params.id);
  const user = await User.findOne({ _id: req.params.id }).select("-password");
  if (!user) {
    throw new CustomError.NotFoundError(`no user with id ${req.params.id}`);
  }
  checkPermission(req.user, user._id);
  res.status(StatusCodes.OK).json({ user });
};

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: "user" }).select("-password");
  res.status(StatusCodes.OK).json({ users });
};

const updateUser = async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    throw new CustomError.BadRequestError("please provide name and email");
  }
  const user = await User.findOneAndUpdate(
    { _id: req.user.userId },
    { name, email },
    { new: true, runValidators: true }
  );
  const tokenUser = { userId: user._id, name: user.name, role: user.role };
  attachCookieToResponse(res, tokenUser);
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const deleteUser = async (req, res) => {
  res.send("delete user");
};

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

const updateUserPassword = async (req, res) => {
  const { password, newPassword } = req.body;
  if (!password || !newPassword) {
    throw new CustomError.BadRequestError("please provide both values");
  }
  const user = await User.findOne({ _id: req.user.userId });
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("not authenticated");
  }
  user.password = newPassword;
  await user.save();
  res.status(StatusCodes.OK).send("password succesfully changed");
};

module.exports = {
  getSingleUser,
  getAllUsers,
  updateUser,
  deleteUser,
  showCurrentUser,
  updateUserPassword,
};
