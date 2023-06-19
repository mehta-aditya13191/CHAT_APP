const http=require("http");
const express=require("express");
const cors=require("cors");
const socketIO=require("socket.io");
const { Socket } = require("dgram");

const app=express();
const port=4500 || process.env.PORT;

const users=[{}];

app.use(cors());

app.get("/",(req,res)=>{
res.send("Hell is working");
})

const server=http.createServer(app);
const io=socketIO(server);

io.on("connection",(socket)=>{
    console.log("new connection");

    socket.on('joined',({user})=>{
        users[socket.id]=user;//users k id ko store krta h socket.id
    console.log(`${user} has joined`)
      socket.broadcast.emit('userJoined',{user:"Admin",message:`${users[socket.id]} has joined`});//agar teesra koi joined hua to hmlogo ko p[ata chal jayega ki kisne join kra h ]
      socket.emit('Welcome',{user:"Admin",message:`Welcome to the best chat,${users[socket.id]}`})
    })

    socket.on('message',({message,id})=>{
       io.emit('sendMessage',{user:users[id],message,id})//isse dono ko pata chle ki kisne msgs bhja and kiso gya h
    })

   socket.on('Disconnect',()=>{
    socket.broadcast.emit(`leave`,{user:"Admin",message:`${users[socket.id]} has left`});
  console.log(`user left`);
   })
    

})

server.listen(port,()=>{
    console.log(`server is working on http://localhost:${port}`);
})