const User= require("../models/user");
const {StatusCodes}= require("http-status-codes")
const CustomError=require("../errors")
const {createJwt,verifyJwt}=require("../utils")

const register= async (req,res)=>{
    const {email,password,name}=req.body;
    const user= await User.create({name,email,password});
    const userToken={userId:user._id,name:user.name,role:user.role}
    const token=createJwt({payload:userToken})

    res.status(StatusCodes.CREATED).json({user:userToken,token:token});
}

const login= async (req,res)=>{
   const {email,password}=req.body;
    const user= await User.findOne({email});
    const userToken={userId:user._id,name:user.name,role:user.role}
    const token=createJwt({payload:userToken});

    const isPasswordMatch=await user.comparePassword(password);

    if(!user){
      throw new CustomError.BadRequestError("invalid email") 
    }
   if(!isPasswordMatch){
       throw new CustomError.UnauthenticatedError("invalid password")
   }
    res.status(StatusCodes.OK).json({user:userToken,token:token})
}



module.exports={register,login};