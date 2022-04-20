import express from 'express'
const app = express()
const port = 5000
import socketServer from './socket.js'
import { getCurrentUser, getRoomUsers, userJoin } from './utils/users.js'

app.get('/', (req, res) => {
    res.send("Hello")
})

const server = app.listen(port, () => console.log('listening at', port))

const io = socketServer(server)

// Runs when the client connects
io.on('connection', (socket) => {


    socket.on('join_room', ({ userName, room }) => {
        const user = userJoin(socket.id, userName, room)
        console.log(user)
        socket.join(user.room)

        // Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })


    // Listen for updates in location
    socket.on('send-update', (location, dice, this_turn) =>{
        console.log(location, dice)
        const user = getCurrentUser(socket.id)
        console.log(user)
        socket.broadcast.to(user.room).emit('receive-update', {location, dice, this_turn})
    })
})