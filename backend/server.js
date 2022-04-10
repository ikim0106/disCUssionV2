/*
References
1. https://www.section.io/engineering-education/nodejs-mongoosejs-mongodb/
2. https://expressjs.com/en/guide/routing.html
3. https://dev.to/ericchapman/nodejs-express-part-5-routes-and-controllers-55d3
4. https://stackoverflow.com/questions/41623528/io-on-is-not-a-function
5. https://socket.io/docs/v4/
6. https://tsh.io/blog/socket-io-tutorial-real-time-communication/

Resources 1~5 were used as learning material
Resource 6 was used to learn about real time chat. Some socket.io code was copied from this resource
server.js handles the backend server using express and its routes
*/

const express = require('express')
// const { append } = require('express/lib/response')
const config = require('../config.json')
const connectToMongoDB = require('./mongo/mongoDB')
const {infamous404, errorHandler} = require('./controllers/handleErrors')
const PORT = parseInt(config.port) || 3004 //default to 3004
const userRouter = require('./routes/userRouter')
const chatRouter = require('./routes/chatRouter')
const msgRouter = require('./routes/messageRouter')

const serber = express() //no i didn't misspell server
serber.use(express.json()) //let express use JSON formatted data

connectToMongoDB()

serber.use('/api/users', userRouter)
serber.use('/api/discuss', chatRouter)
serber.use('/api/messages', msgRouter)

serber.use(errorHandler)
serber.use(infamous404)


const server = serber.listen(PORT, console.log(`backend started, listening on port ${PORT}`))

const soket = require('socket.io')(server, {
   pingTimeout: 100000,
   cors: {
      origin: 'http://localhost:3000',
   }
})

soket.on('connection', (socket)=> {
   // console.log('socket connected')
   socket.on('getLoggedInUserID', (data) => {
      console.log('breh', data._id)
      socket.join(data._id)
      socket.emit('connected')
   })

   socket.on('connectChat', (room)=> {
      console.log('user is in room', room)
      socket.join(room)
   })

   socket.on('sendMessage', (newMessage) => {
      let chat = newMessage.send_in[0]

      if(!chat.users || chat.users.length===0) {
         // console.log('undefined')
         return
      }
      chat.users.forEach(user=> {
         if(user._id!==newMessage.sender._id) 
            socket.in(user._id).emit('gotMessage', newMessage)
         else return
      })
   })
})