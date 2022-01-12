const {getSingleUser,getAllUsers,updateUser,deleteUser,showCurrentUser,updateUserPassword}=require("../controllers/userController");
const express=require("express");
const router=express.Router();


router.route("/").get(getAllUsers)

router.route("/:userId").get(getSingleUser).patch(updateUser).delete(deleteUser)

module.exports=router;

