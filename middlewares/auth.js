// //Admin
// const jwt=require("jsonwebtoken")
// exports.auth=async (req,res,next)=>{
// try{
         
    
  
//     // console.log("header se",req.header("Authorization").replace("Bearer ",""))
//           const token=req.body.token||req.cookies.token
//           ||
//           req.header("Authorization").replace("Bearer ","");

// if(!token)
// {
//     return res.json({
//         success:false,
//         message:"Token is not verified"
//     })
// }
// try{
//     const decode= jwt.verify(token,"Akash")
//     // console.log(decode);
//     // console.log(req);
//     req.user=decode;
//     // console.log("req ki body  is ",req.user);
// }
// catch(err)
// {
//     return res.json({
//         success:false,
//         message:err.message
//     })
// }
// next();
// }catch(err)
// {
// return res.status(400).json({
//     success:false,
//     message:err.message
// })
// }
// }


const jwt = require("jsonwebtoken");

exports.auth = async (req, res, next) => {
    try {
        let token = req.header("Authorization");

        if (!token) {
            token = req.body.token || req.cookies.token;
        } else {
            token = token.replace("Bearer ", "");
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token is not provided"
            });
        }

        const decoded = jwt.verify(token, "Akash");
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: err.message
        });
    }
};
