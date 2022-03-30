/*
References
1. https://www.section.io/engineering-education/nodejs-mongoosejs-mongodb/
2. https://expressjs.com/en/guide/routing.html
3. https://dev.to/ericchapman/nodejs-express-part-5-routes-and-controllers-55d3

These resources were used as learning material
server.js handles the backend server using express and its routes
*/

const express = require('express')
const { append } = require('express/lib/response')
const config = require('../config.json')
const {dummyData} = require('./data/dummyData')
const connectToMongoDB = require('./mongo/mongoDB')
const {infamous404, errorHandler} = require('./controllers/handleErrors')
const PORT = parseInt(config.port) || 3004 //default to 3004
const userRouter = require('./routes/userRouter')

const serber = express() //no i didn't misspell server
serber.use(express.json()) //let express use JSON formatted data

connectToMongoDB()

serber.get('/', (request, response) => {
   console.log("삽족밥~")
   response.send('backend is functional')
})

serber.get('/api/' , (request, response) => {
   console.log('불족발')
   response.send('불족발')
})

serber.get('/api/getChats/', (request, response) => {
   response.send(dummyData)
})

serber.use('/api/users', userRouter)
serber.use(errorHandler)
serber.use(infamous404)


serber.listen(PORT, console.log(`server started, listening on port ${PORT}`))