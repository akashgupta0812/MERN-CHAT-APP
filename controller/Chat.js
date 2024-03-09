
const Chat = require("../modells/Chat");
const User = require("../modells/User");
exports.AccessChat = async (req, res) => {
    try {
        const { UserId } = req.body;

        const isChat = await Chat.findOne({
            isGroup: false,
            $and: [
                { users: { $elemMatch: { $eq: UserId } } },
                { users: { $elemMatch: { $eq: req.user.id } } }
            ]
        }).populate("users", "-password").populate({
            path: "latestMessage",
            select: "sender content chat"
        });
        //    console.log("is chat if already exit ",isChat);
        if (isChat=== null) {
            try {
                const newChat = await Chat.create({
                    ChatName: "sender",
                    users: [UserId, req.user.id]
                });
                  const populatedChat = await Chat.findById(newChat._id).populate("users", "-password");
                //   console.log("if no chat is exit",populatedChat);
                //  await newChat.populate("users", "-password").execPopulate();
//   await newChat.populate("users", "-password").execPopulate();
                return res.status(200).json({
                    success: true,
                    
                    data: populatedChat,
                    message: "Chat created successfully"
                });
            } catch (err) {
                return res.status(401).json({
                    success: false,
                    message: "Error creating chat: " + err.message
                });
            }
        }

        return res.status(200).json({
            success: true,
            data: isChat,
            message: "Chat found successfully"
        });
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Error accessing chat: " + error.message
        });
    }
};

// exports.AccessChat=async(req,res)=>{
//     try{
//         const {UserId}=req.body;
//         // const username=await User.findOne({_id:UserId});
//         // console.log("here is printing ",username.FirstName);
//         // const receivername=username.FirstName+" "+username.LastName
//         const isChat=await Chat.find({
//             isGroup:false,
//             $and:[
//             {users:{$elemMatch:{$eq:UserId}}},
//             {users:{$elemMatch:{$eq:req.user.id}}}
//             ]
//         }).populate("users","-password")
//         // .populate("latestMessage")
//         .populate({
//             path:"latestMessage",
//             select:"sender content chat"
//         })

//         console.log("is chat is present  ",isChat);
//         if(isChat.length===0)
//         { 
//             try{
//                 const newchat=await Chat.create(
//                 {
//                     ChatName:"sender",
//                     users:[UserId,req.user.id]
                    
//                 }
//                )
// //                const populatedChat = await newchat.populate({
// //     path: "users",
// //     select: "-password" // Exclude the password field
// // }).execPopulate(); 
// try{

    
//     const populatedChat = await newchat.populate("users", "-password").execPopulate();
//      return res.status(200).json({
//                 success:true,
//                 data:populatedChat
//                })
// }
// catch(err)
// {
//     res.status(401).json(
//         {
//             success:false,
//             message:err.message
//         }
//     )
// }


            
//             }
//             catch(err)
//             {
//                     return res.status(401).json({
//                         success:false,
//                         message:err.message
//                     })
//             }
           
//             // .populate("users","-password")
            
//         }
//         return res.status(200).json(
//             {
//                 success:true,
//                 data:isChat,
//                 message:"Fetch Succesfully"
//             }
//         );
//     }catch(error)
//     {
//         // console.log(error.message);
//        return  res.status(401).json(
//         {
//             success:false,
//             message:error.message
//         }
//        )
//     }
// }
// exports.AccessChat=async(req,res)=>{




// //     try{
// //         const {UserId}=req.body;
// //         // const username=await User.findOne({_id:UserId});
// //         // console.log("here is printing ",username.FirstName);
// //         // const receivername=username.FirstName+" "+username.LastName
// //         const isChat=await Chat.find({
// //             isGroup:false,
// //             $and:[
// //             {users:{$elemMatch:{$eq:UserId}}},
// //             {users:{$elemMatch:{$eq:req.user.id}}}
// //             ]
// //         }).populate("users","-password")
// //         // .populate("latestMessage")
// //         .populate({
// //             path:"latestMessage",
// //             select:"sender content chat"
// //         })

// //         console.log("is chat is present  ",isChat);
// //         if(isChat.length===0)
// //         { 
// //             try{
// //                 const newchat=await Chat.create(
// //                 {
// //                     ChatName:"sender",
// //                     users:[UserId,req.user.id]
                    
// //                 }
// //                )
// // //                const populatedChat = await newchat.populate({
// // //     path: "users",
// // //     select: "-password" // Exclude the password field
// // // }).execPopulate(); 
// // try{

    
// //     const populatedChat = await newchat.populate("users", "-password").execPopulate();
// //      return res.status(200).json({
// //                 success:true,
// //                 data:populatedChat
// //                })
// // }
// // catch(err)
// // {
// //     res.status(401).json(
// //         {
// //             success:false,
// //             message:err.message
// //         }
// //     )
// // }


            
// //             }
// //             catch(err)
// //             {
// //                     return res.status(401).json({
// //                         success:false,
// //                         message:err.message
// //                     })
// //             }
           
// //             // .populate("users","-password")
            
// //         }
// //         return res.status(200).json(
// //             {
// //                 success:true,
// //                 data:isChat,
// //                 message:"Fetch Succesfully"
// //             }
// //         );
// //     }catch(error)
// //     {
// //         // console.log(error.message);
// //        return  res.status(401).json(
// //         {
// //             success:false,
// //             message:error.message
// //         }
// //        )
// //     }
// }
exports.FetchChats=async(req,res)=>{
    // console.log("hii  mei call hua");
    // console.log("user jop login hai ",req.user.id);
    try{
        const result=await Chat.find({
            users: { $in: [req.user.id] }
        }).populate("users","-password").populate("AdminName","-password")
        // .populate("latestMessage")
        .populate({
            path:"latestMessage",
            select:"sender content chat"
        })
        .sort({ updatedAt: -1 });
        //sort({updatedAt:-1})
// console.log("result ********* ",result);

        return res.status(200).json(
            {
                success:true,
                data:result,
                
            }
        )
        // return res.send(result);
    }catch(error)
    {
return res.status(401).json(
    {
        success:false,
        message:error,
    }
)
    }
}
exports.CreateGroupChat=async(req,res)=>{
    try{
const {users,chatname}=req.body;
// console.log("users ",users);
if(users.length<2  || !chatname)
{
    return res.json(
        {
            success:false,
            message:"Group must Contain more than one memeber "
        }
    )
}
     users.push(req.user.id);
    //  console.log(" after adding me  ",users);
    //  const registeruser=await User.create(
    //     {
    //         FirstName:chatname,
    //         LastName:"x",
    //         password:"123456789",
    //         email:"blinkchat@company.com",
    //         image:`https://api.dicebear.com/5.x/initials/svg?seed=${chatname}`
    //     }
    //  )
   const newgroup=await Chat.create(
    {
        isGroup:true,
        ChatName:chatname,
        users:users,
        AdminName:req.user.id
    }
   )

   const FullChats=await Chat.findOne({_id:newgroup._id}).populate("users","-password").populate("AdminName","-password").populate("latestMessage")
   return res.json(
    {
        success:true,
        FullChats,
        
    }
   )

    }catch(err)
    {
return res.send(err.message)
    }
}
exports.RenameGroupName=async(req,res)=>{
    try{
        const {chatId,chatname}=req.body;
        if(  !chatId || !chatname )
        {
            res.status(400).json(
                {
                    success:false,
                    message:"chatname is required"
                }
            )
        }
        const updatedchat=await Chat.findByIdAndUpdate(chatId,{
            ChatName:chatname
        },{new:true}).populate("users","-password").populate("AdminName","-password")
        return res.json(
            {
                success:true,
                updatedchat
            }
        )
    }catch(err)
    {
return res.send(err.message)
    }
}
exports.Addtogroup=async(req,res)=>{
    try{
     const {chatid,userid}=req.body;
     if( ! chatid   ||  ! userid ) 
     {
        return res.json(
        {
            sucess:false,
            message:"Internal Error"
        }
        )
     }
     const user=await Chat.findOne({users:userid})
     if(user)
     {
        return res.json({
            sucess:false,
            message:"Already Joined this group! :) "
        })
     }
     const removefromgroup=await Chat.findByIdAndUpdate(chatid,{
        $push:{
            users:userid
        }},{new:true}
     ).populate("users","-password").populate("AdminName","-password")
     return res.status(200).json(
        {
            succ:true,
            removefromgroup
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
exports.Removefromgroup=async(req,res)=>{
    try{
     const {chatid,userid}=req.body;
     if( ! chatid   ||  ! userid ) 
     {
        return res.json(
        {
            sucess:false,
            message:"Internal Error"
        }
        )
     }
     const user=await Chat.findOne({users:userid})
     if(!user)
     {
        return res.json({
            sucess:false,
            message:"Internal Error"
        })
     }
     const removefromgroup=await Chat.findByIdAndUpdate(chatid,{
        $pull:{
            users:userid
        }},{new:true}
     ).populate("users","-password").populate("AdminName","-password")
     return res.status(200).json(
        {
            success:true,
            removefromgroup
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