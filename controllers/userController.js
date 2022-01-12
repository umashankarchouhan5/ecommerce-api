

const getSingleUser= async (req,res)=>{
    res.send("getsingle user")
}

const getAllUsers= async (req,res)=>{
    res.send("get all users")
}

const updateUser= async (req,res)=>{
    res.send("updateuser")
}

const deleteUser= async (req,res)=>{
    res.send("delete user");
}

const showCurrentUser= async (req,res)=>{
    res.send("show current user");
}
const updateUserPassword= async (req,res)=>{
    res.send("update user password")
}

module.exports= {getSingleUser,getAllUsers,updateUser,deleteUser,showCurrentUser,updateUserPassword};