const express = require('express')
const config = require('../config.json')
const {dummyData} = require('./data/dummyData')
const connectToMongoDB = require('./mongo/mongoDB')

const serber = express() //no i didn't misspell server

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


const PORT = parseInt(config.port) || 3000
serber.listen(PORT, console.log(`server started, listening on port ${PORT}`))