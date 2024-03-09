const Chat = require("../modells/Chat");
const Message=require("../modells/Message");
const { create } = require("../modells/User");
// const { Login } = require("./Auth");
exports.one_one_chat=async(req,res)=>{
try{
const {content,chatid}=req.body;
// console.log("userid ",userid," content ",content," chatid", chatid);
if(!content )
{
    return res.json({
        success:false,
        message:"content is missing"
    })
}
if(!content || !chatid)
{
    return res.json(
        {
            success:false,
            message:"Internal server error"
        }
    )
}
// const newmessage=await Message.findByIdAndUpdate(req.user.id,
//     {
//         content:content,
//         chat:chatid
//     }).populate("chat").populate("sender")
// const newmessage=await Message.findOne({chat:chatid})
// if(!newmessage)
// /
    const createmessage=await Message.create(
        {
            sender:req.user.id,
            content:content,
            chat:chatid
        }
        )
        // console.log("create message ",createmessage);
        // console.log("create message ",createmessage._id);
        await Chat.findByIdAndUpdate({_id:chatid},{
            latestMessage:createmessage._id
        },{new:true}).populate("latestMessage").populate("users")
        //   await Chat.findOneAndUpdate({ users:[userid,req.user.id]},
        //     {
        //     latestMessage:createmessage._id
        //     },{new:true}).populate("latestMessage").populate("users")
        //  console.log("newmessage ",createmessage);
        //    await createmessage.populate('sender').populate('chat').execPopulate();
        const populatedMessage = await Message.findById(createmessage._id)
    .populate('sender')
    // .populate('chat');
    .populate({
        path: 'chat',
        populate: {
            path: 'users',
            model: 'User' // Assuming 'User' is the model name for user documents
        }
    });

// console.log("Populated createmessage   **************:", populatedMessage);

//          await createmessage.populate('sender').populate(
//     'chat'
// ).execPopulate();
        // console.log("newmessage ",createmessage);
      
            // console.log("updatechat ",updatechat);
          
            return res.json(
                {
                    success:true,
                    data:populatedMessage
                }
            )
        }
        catch(err)
{

    // console.log(err.message);
return res.status(401).json(
    {
        success:false,
        message:err.message
    }
)
}

}
exports.AllMessages=async(req,res)=>{
    try{
        // console.log("re ki params mei ",req.params);
const messages=await Message.find({chat:req.params.chatId}).populate("sender")
// .populate("chat")
    .populate({
        path: 'chat',
        populate: {
            path: 'users',
            model: 'User' // Assuming 'User' is the model name for user documents
        }
    });

//console.log(messages);
return res.status(200).json(
    {
        success:true,
        data:messages
    }
)
    }catch(err)
    {
return res.json(
    {
        success:false,
        message:err.message
    }
)
    }
}