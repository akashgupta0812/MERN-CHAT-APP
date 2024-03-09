const User=require("../modells/User")              
const Otp=require("../modells/Otp")
const otpGenerator=require('otp-generator')
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const {ImageUploader}=require("../utilis/ImageUploader")
exports.SendOtp= async (req,res)=>{
try{
//fetch email from req ki body
const {email}=req.body;
// console.log("email is ",email);
//check if email is exit or not  in user database
const useremail= await User.findOne({email})
// if exit return response entited as user already exit
if(useremail)
{
   return  res.status(400).json({
        success:false,
        message:"User already exit"
    })
}
//if useremail has no valid response means user does not exit  in that situation you sennd otp tp new user to veriify the user emal to verfiy the emial prior to save in databse
const newotp=otpGenerator.generate(6,{
    upperCaseAlphabets:false,
    lowerCaseAlphabets:false,
    specialChars:false
})
//check otp is unique or not if otp is not unique then it will create the problem and create th eotp again agian till it is unique
// console.log("generated otp is ",newotp);
const votp=await Otp.findOne({otp:newotp})
// console.log("votp for the first time ",votp);

//if otp exit create new otp
if(votp)
{
    while(votp)
    {
        const newotp=otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false
        })
         votp=await Otp.findOne({otp:newotp})
    
    }
    newotp=votp;
    
}


//now we get the unique otp store this otp to databse in order to verify the user 
const OTPpayload={email,newotp}
// console.log("otp payload is ",OTPpayload);
const otpnew=await Otp.create({
    email:OTPpayload.email,
    otp:OTPpayload.newotp
})
// console.log("ot  p   is am here  ",otpnew);
// console.log("new otp created checked here",otpnew);
res.status(200).json({
    success:true,
    message:"otp created successfuly",
    otpnew,
    
})
}catch(err)
{
res.status(400).json({
    success:false,
    message:err.message
})
}
}
exports.Login=async(req,res)=>{
    try{
        const {email,password}=req.body;
        const UserDetail=await User.findOne({email})    
            if(!UserDetail)
        { 
    
            return res.status(401).send({
                success:false,
                message:`User does not exit please Signup First!!`
            })
        }
        

        const payload={
            email:UserDetail.email,
            id:UserDetail.id,
        

        }
        const option={
            expires:new Date(Date.now()+1*24*60*60*1000),
            httpOnly:true
        }
    
        if( await bcrypt.compare(password,UserDetail.password))
        {
          const token=jwt.sign(payload,"Akash",{
            expiresIn:"24hr"
          })
        

          UserDetail.token=token;
          
          UserDetail.password=undefined;
          // console.log(exisiting);
        //   console.log("Userdetails ",UserDetail);
          res.cookie("token",token,option).status(200).json(
              {
                  success:true,
                  token:token,
                  UserDetail,
                  message:"login Successfull"
                
              }
          )
        }
        else 
        {
            return res.status(400).json({
                success:false,
                message:"Password does not  matched !please try again ..."
            })
        }


    }catch(err)
    {
        return res.status(401).json({
            success:false,
            message:err.message,
            
        })
    }
}
exports.Signup=async(req,res)=>{
    try{
    
 const {firstName,LastName,email,image,password,confirmpassword,otp}=req.body; 
          if(!firstName  || !LastName || !email || ! password || !confirmpassword )
          {
            return res.status(403).json(
                {
                    success:false,
                    message:"All Fields are Required",
                }
            )
          }
            if(password!=confirmpassword)
        {
            return res.status(400).json({
                success:false,
                message:"password and confirmpassword is not matched"
            })
        }
        //check user already exit or not with given email
        const UserDetails=await User.findOne({email})
        if(UserDetails)
        {
            return res.status(400).json(
                {
                    success:false,
                    message:"User Already Exit ! "
                }
            )
        }
         const otpvalidate=await Otp.findOne({email}).sort({CreatedAt:-1}).limit(-1)
    //    console.log("hey yha tak aaya hu ");
    //    console.log("otpvalidate  ",otpvalidate);

       
         if(!otpvalidate)
        {
            return res.status(403).json({
                success:false,
                message:"OTP not found"
            })
        }
        if(otpvalidate.otp!=otp)
        {    
          
            return res.status(401).json({
                success:false,
                otpvalidate,
                message:"Otp does not matched"
            })
        }

        let hashpassword;
        try{
            hashpassword=await bcrypt.hash(password,10);
        }
        catch(error)
        {
                return res.status(401).json({
                success:false,
                message:error.mess
            })
        }
        const NewUser=await User.create(
            {
                FirstName:firstName,
                LastName:LastName,
                email:email,
                password:hashpassword,
                image:!image?  `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${LastName}`  :  uploadImage(),
            }
        )
        return res.status(200).json({
            success:true,
            message:"Welcome to Blinkchat!!",
            NewUser
        })


    }catch(error){
             res.status(401).json({
            success:false,
            message:error.message
            ,
        })
    }
}
exports.UserFilter=async(req,res)=>{
 const name  = req.query.name;
//  console.log(name);

    try {
        // Perform case-insensitive search for users whose name starts with the provided query
        const users = await User.find({ FirstName: { $regex: new RegExp(`^${name}`, 'i') } }).find({ _id: { $ne: req.user.id } })
                                 .sort({ FirstName: 1 }); // Sort users by name in ascending order
        //   console.log(users);
         return res.status(200).json(
        {
            success:true,
            data:users
        }
    )
    } catch (error) {
        console.error('Error searching users:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }






//     const searchkey=req.query.name? {
//     FirstName:{$regex:req.query.name,$options:"i"}
    
//     }   :{    }  
    
//     // console.log("search key ",searchkey);
     
// const  response=await User.find(searchkey).find({ _id: { $ne: req.user.id } });
//     //   console.log("REsponse in api  call ");
//     return res.status(200).json(
//         {
//             success:true,
//             data:response
//         }
//     )
}
exports.updateDisplayPictures=async(req,res)=>{
    try{
        const id=req.user.id;
        // const {image}=req.files.file
        // console.log("here  you are");
        // const image = req.file.name
         const image = req.files.image
        // console.log("image ",image);
        // console.log("req k andar ky ahai ",req);
        const img= await ImageUploader(image,"AKASH",1000,1000)
        // console.log(img);
        const UpdatedProfile=await User.findByIdAndUpdate(id,
            {
                image:img.secure_url
            },{new:true})
            return res.status(200).json({
                success:true,
                message:"DisplayProfile is updated successfully",
                data:UpdatedProfile
            })
    }catch(err)
    {
        return res.json({
            success:false,
            message:err.message
        })
    }
}