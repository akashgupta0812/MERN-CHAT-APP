//Admin
const jwt=require("jsonwebtoken")
exports.auth=async (req,res,next)=>{
try{

          const token=req.body.token||req.cookies.token||req.header("Authorization").replace("Bearer ","");

if(!token)
{
    return res.json({
        success:false,
        message:"Token is not verified"
    })
}
try{
    const decode= jwt.verify(token,"Akash")
    // console.log(decode);
    // console.log(req);
    req.user=decode;
    // console.log("req ki body  is ",req.user);
}
catch(err)
{
    return res.json({
        success:false,
        message:err.message
    })
}
next();
}catch(err)
{
return res.status(400).json({
    success:false,
    message:err.message
})
}
}

