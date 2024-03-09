const express = require("express")
const router = express.Router()
// Import the required controllers and middleware functions
const {
  Login,
  Signup,
UserFilter,
SendOtp,
updateDisplayPictures
} = require("../controller/Auth")
const { auth } = require("../middlewares/auth")

// Routes for Login, Signup, and Authentication

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

// Route for user login
router.post("/login", Login)
// Route for user signup
router.post("/signup", Signup)
router.post("/sendotp", SendOtp)
//Route for UserSearch
router.get("/user",auth,UserFilter)
router.put("/updateDisplayPicture", auth, updateDisplayPictures)
module.exports = router