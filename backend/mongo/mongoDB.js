/*
References
1. https://mongoosejs.com/docs/migrating_to_6.html#no-more-deprecation-warning-options
2. https://www.section.io/engineering-education/nodejs-mongoosejs-mongodb/
3. https://github.com/jdesboeufs/connect-mongo/blob/master/example/mongoose.js

All three references were used as learning material.
mongoDB.js handles connections to our mongoDB server and any errors that occur
*/

const mongoose = require('mongoose')
const config = require('../../config.json')
const mongoURI = config.mongoURI

const connectToMongoDB = async () => {
   // console.log('mongoURI', mongoURI)
   const debug = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
   })
   const db = debug.connection
   db.on('error', ()=>{
      console.log('monkas mongo error')
      process.exit()
   })
   console.log(`connected to ${db.host}`)
}

module.exports = connectToMongoDB