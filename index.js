//Library
const express = require("express");
const cors = require('cors')
const http = require("http");
const env = require('dotenv');
env.config();
const connectDatabase = require('./connectDatabase')
const socketio = require("socket.io")
const { addUser, getUser, removeUser, getRoomUsers} = require("./entity");
const User = require('./models/UserModel')
const Message = require('./models/MessageModel')
//Instances
const app = express();
const server = http.createServer(app);
const io = socketio(server,{cors: { origin: '*' }})
const PORT = process.env.PORT;

//Middleware
app.use(express.urlencoded({extended: true}))
app.use(express.json())
// app.use(cors())

app.use(cors({
  origin: ["https://chat-app-beryl-three.vercel.app"],
  methods: ["GET", "POST"],
  credentials: true
}));

//Database
connectDatabase();

//join
app.post('/join', async (req, res)=>{

const userName = req.body.name;
const chatRoom = req.body.room;
console.log(userName, chatRoom)
//create user
const createdUser =  User({ name: userName, room: chatRoom})
await createdUser.save();
console.log(`${createdUser} in database`)
res.send(`success`);
})

app.post('/message', async (req, res) => {
    try {
        const SendMessage = req.body.message;// Destructure message from request body
  
      // Create a new message document using Mongoose model
      const newMessage =  Message({ message : SendMessage });
     
      // Save the message to MongoDB
      await newMessage.save();
  
      console.log(`Message "${SendMessage}" created in database`);
      res.status(200).json({ message: 'Message saved successfully' });
    } catch (error) {
      console.error('Error saving message:', error);
      res.status(500).json({ error: 'Failed to save message' });
    }
  });


// Socket

io.on('connect', (socket)=>{
console.log('user connected')
socket.on('join', ({name, room, date}, callBack)=>{

const {user, err} = addUser({id:socket.id, name: name, room: room, date: date});
console.log(user)

if(err){
callBack(err)
return;
}

socket.join(user.room);

socket.emit('message', {user: 'admin', text: `Welcome ${user.name}`, date: `Created on ${date}`})

socket.broadcast.to(user.room).emit('message', {
user: 'admin',
text: `${user.name} has joined`,
date: `${user.name} is joined on ${date}`
})
io.to(user.room).emit('roomMembers', getRoomUsers(user.room))
})

socket.on('sendMsg', (message, callBack) => {
const user = getUser(socket.id)
if(user){
io.to(user.room).emit('message', {  user: user.name,
text: message})
}
callBack()

})

socket.on('disconnect', ()=>{
console.log('user disconnected')
const user = removeUser(socket.id);
if(user){
io.to(user.room).emit('message', {  user: 'admin',
text: `${user.name} has left`})
}
})
})

server.listen(PORT, ()=> console.log('server started ............'))


