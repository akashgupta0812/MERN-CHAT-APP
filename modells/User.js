const mongoose=require("mongoose")
const UserModel=new mongoose.Schema(
    {
        email:{
            type:String,
            required:true,
        },
        FirstName:{
            type:String,
            trim:true,
            required:true,
        },
        LastName:{
            type:String,
            trim:true,
            required:true,
        },
        password:
        {
            type:String,
            required:true,
        }
        ,
        image:{
            type:String,
            required:true
        },
         token:{
            type:String,
        }

    }
)
module.exports=mongoose.model("User",UserModel);