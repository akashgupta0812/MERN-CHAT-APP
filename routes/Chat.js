const express = require("express")
const router = express.Router()
// Import the required controllers and middleware functions
const {
  AccessChat,
 FetchChats,
 CreateGroupChat,
 RenameGroupName,
 Addtogroup,
 Removefromgroup
} = require("../controller/Chat")
const { auth } = require("../middlewares/auth")



// ********************************************************************************************************
//                                      Chats routes
// ********************************************************************************************************



router.post("/accesschat",auth,AccessChat);
// Route for user signup
router.get("/fetch-all-chats",auth,FetchChats);
router.post("/CreateGroupChat",auth,CreateGroupChat)
router.put("/renamegroupname",auth,RenameGroupName)
router.put("/addtogroup",auth,Addtogroup)
router.put("/removefromgroup",auth,Removefromgroup)

// router.post("/signup", Signup)
//Route for UserSearch
// router.get("/user",auth,UserFilter)
module.exports = router