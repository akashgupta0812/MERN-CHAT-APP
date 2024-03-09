const mongoose=require("mongoose")
const ChatModel=new mongoose.Schema(
{
    isGroup:{
        type:Boolean,
        default:false,
    },
    ChatName:{
        type:String,
        trim:true,
    },
    users:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
}],
    latestMessage:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Message"
    },
    AdminName:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }
    
},
{
    timestamps:true
}
)
module.exports=mongoose.model("Chat",ChatModel);