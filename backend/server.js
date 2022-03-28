const express = require('express')
const config = require('../config.json')

const serber = express() //no i didn't misspell server kek

serber.get('/', (request, response) => {
   response.send('bruh')
})

const PORT = parseInt(config.port) || 3000
serber.listen(PORT, console.log(`server started, listening on port ${PORT}`))