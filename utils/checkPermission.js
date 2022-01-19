const CustomError = require("../errors");
const checkPermission = (user, userId) => {
  if (user.role === "admin") return;
  if (user.userId === userId.toString()) return;
  throw new CustomError.UnauthorizedError("not authorized to access ");
};

module.exports = checkPermission;
