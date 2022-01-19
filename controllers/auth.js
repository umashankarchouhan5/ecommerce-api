const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { attachCookieToResponse } = require("../utils");

const register = async (req, res) => {
  const { email, password, name } = req.body;
  const user = await User.create({ name, email, password });
  const userToken = { userId: user._id, name: user.name, role: user.role };
  attachCookieToResponse(res, userToken);

  res.status(StatusCodes.CREATED).json({ user: userToken });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  const userToken = { userId: user._id, name: user.name, role: user.role };

  const isPasswordMatch = await user.comparePassword(password);

  if (!user) {
    throw new CustomError.BadRequestError("invalid email");
  }
  if (!isPasswordMatch) {
    throw new CustomError.UnauthenticatedError("invalid password");
  }
  attachCookieToResponse(res, userToken);
  res.status(StatusCodes.OK).json({ user: userToken });
};

const logout = async (req, res) => {
  res.cookie("token", "token", {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.send("userlogout");
};

module.exports = { register, login, logout };
