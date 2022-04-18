import express from 'express'
const app = express()
const port = 5000
import socketServer from './socket.js'

app.get('/', (req, res) => {
    res.send("Hello")
})

const server = app.listen(port, () => console.log('listening at', port))

const io = socketServer(server)

io.on('connection', (socket) => {
    console.log("client connected")
    socket.emit('init', { data: socket.id })
    socket.on('join_room', (room, callback) => {
        if (room) {
            let rooms = io.sockets.adapter.rooms.get(room)?.size
            if (rooms == undefined) {
                rooms = 1
            }
            else {
                ++rooms
            }
            socket.join(room)
            io.to(room).emit('total', { length: rooms })
            callback(true)
            return
        }
        callback(false)
    })

    // socket.on('message')
})