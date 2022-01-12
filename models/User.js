const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");

const UserSchema= new mongoose.Schema({name:{
    type:String,
    required:[true,"please provide name"],
    minlength:4,
    maxlength:50
},
email:{
    type:String,
    required:[true,"please provide email"],
    unique:true,

},
password:{
    type:String,
    required:[true,"please provide password"],
    minlength:6
},
role:{
    type:String,
    enum:["admin","user"],
    default:"user"
}
})

UserSchema.pre("save",async function(){
    const salt= await bcrypt.genSalt(10);
    this.password= await bcrypt.hash(this.password,salt);
})

UserSchema.methods.comparePassword=async function(candidatePassword){
    const isMatch=await bcrypt.compare(candidatePassword,this.password)
    return isMatch;
}

module.exports=mongoose.model("user",UserSchema);