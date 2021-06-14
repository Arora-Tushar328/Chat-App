const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const app = express()
const Filter = require('bad-words')
const server = http.createServer(app)
const io =socketio(server)
const {generateMessage,generateLocationMessage} = require('./utils/Data')
const {addUser,removeUser,getUser,getUsersInRoom} = require('./utils/users')
const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath))
//server(emit)->client(recieve)->countupdated
//client(emit)->server(recieve)->increment
//count for callbacking
// let count = 0
    // socket.emit('countUpdated',count)
    // //For client to server
    // socket.on('increment',()=>{
    //     count++
    //     io.emit('countUpdated',count)
    // })

    //for connection 
io.on('connection', (socket) => {
    console.log('New WebSocket connection')
    //...options is the spread operator
    socket.on('join',(options,callback)=>{
        const {error,user}= addUser({id:socket.id , ...options})
        if(error){
            return callback(error)
        }
        socket.join(user.Room)
        socket.emit('message',generateMessage('Admin','Welcome!!'))
        //socket.broadcast.to,emit is limiting to specific hat room It emit the messsage to the same room
        socket.broadcast.to(user.Room).emit('message',generateMessage('Admin',`${user.username} has joined the room`))
        io.to(user.Room).emit('RoomData',{
            Room: user.Room,
            users: getUsersInRoom(user.Room)

        })
        callback()
    })

    socket.on('sendMessage', (message,callback) => {
        const user = getUser(socket.id)

        const filter = new Filter()
        if(filter.isProfane(message)){
return callback('Profanity is not allowed!!')
        }
        io.to(user.Room).emit('message', generateMessage(user.username,message))
        callback()
    })
        socket.on('sendLocation',(coords,callback)=>{
            const user = getUser(socket.id)
            //callback is used fpor acknowledge the server from client
       io.to(user.Room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
        })
    //If the user is diconnected
    socket.on('disconnect',()=>{
        const user = removeUser(socket.id)
        if(user){
            io.to(user.Room).emit('message',generateMessage('Admin',`${user.username} has Left the Room`))
             io.to(user.Room).emit('RoomData',{
            Room: user.Room,
            users: getUsersInRoom(user.Room)

        })
        }
      
    })
})

server.listen(port,()=>{
    console.log(`Server is up on port ${port}`)
})
