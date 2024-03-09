
const express=require("express");
const app=express();//instance of express
require("dotenv").config();
const cors = require('cors');
const cookieParser=require("cookie-parser")
const {chats}=require("./utilis/data")
const userRoutes=require("./routes/User")
const chatRoutes=require("./routes/Chat");
const MessageRoutes=require("./routes/Messages");
const PORT=process.env.PORT||6000;
const {CloudinaryConnect}=require("./config/Cloudinary")
const fileUpload=require("express-fileupload")
app.use(cors({
    // origin:"http://localhost:3000",
    origin:"https://expresschatpro.netlify.app/",
    credentials:true,
    optionSuccessStatus:200,
}))
app.use(express.json());//middleware in pace of bodyParser
app.use(cookieParser());

const server=app.listen(PORT,()=>{
    console.log(`server is started at port ${PORT}`);
})
app.use(fileUpload(
    {
        useTempFiles : true,
        tempFileDir : '/tmp/'
    }
))
CloudinaryConnect();
const dbConnect=require("./config/database")
dbConnect();
app.get("/",(req,res)=>{
    return res.json({
        success:true,
        message:"Your server is up and running"
    })
})
app.use("/api/v1/auth",userRoutes);
app.use("/api/v1/chat",chatRoutes);
app.use("/api/v1/message",MessageRoutes);

app.get("/api/data",(req,res)=>{
    res.send(chats)
})
    app.get("/api/data/:id",(req,res)=>{
    
    const newmessage=chats.filter((messsage)=>{
    return  messsage._id==req.params.id
    })
    res.send(newmessage);
})
const io=require('socket.io')(server,{
    pingTimeout:60000,
    cors:{
        origin:"https://expresschatpro.netlify.app/"
    }
})
io.on("connection",(socket)=>{
    console.log("connected to socket.io");
    socket.on("setup",(userData)=>{
      socket.join(userData._id)
    //   console.log("user ka id ",userData._id);
    socket.emit("connected")
    })
    socket.on('join chat',(room)=>{
        socket.join(room)
        // console.log("user joined room",room);
        socket.emit("connected")
    })
    socket.on("new message",(newMessageReceived)=>{
var chat=newMessageReceived.chat;
// console.log(newMessageReceived);
// console.log(newMessageReceived);

if(!chat.users) return console.log("chats.users not defined");
chat.users.map(user=>{
    if(user._id===newMessageReceived.sender._id) return;
    // console.log(user);
    socket.in(user._id).emit("message received",newMessageReceived)
})
    })
})