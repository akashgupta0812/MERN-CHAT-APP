const express = require("express")
const router = express.Router()
const {
    one_one_chat, AllMessages
}=require("../controller/Message")
const { auth } = require("../middlewares/auth")
router.post("/chat-one",auth,one_one_chat);
router.get("/getchat/:chatId",auth,AllMessages)





module.exports = router