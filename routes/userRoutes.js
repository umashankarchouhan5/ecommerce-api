const {
  getSingleUser,
  getAllUsers,
  updateUser,
  deleteUser,
  showCurrentUser,
  updateUserPassword,
} = require("../controllers/userController");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");
const express = require("express");
const router = express.Router();

router
  .route("/")
  .get(authenticateUser, authorizePermissions("admin", "user"), getAllUsers);

router.route("/showUser").get(authenticateUser, showCurrentUser);
router.route("/updateUser").patch(authenticateUser, updateUser);
router.route("/updateUserPassword").patch(authenticateUser, updateUserPassword);

router.route("/:id").get(authenticateUser, getSingleUser).delete(deleteUser);

module.exports = router;
