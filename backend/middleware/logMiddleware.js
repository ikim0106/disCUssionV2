const userSchema = require('../databaseSchema/userSchema')
const ObjectId = require('mongoose').Types.ObjectId
const asyncHandler = require('express-async-handler')

const getLoggedinUser = asyncHandler(async (req, res, next) => {
   // console.log('req.headers', req.headers)
   let header = req.headers.authorization
   if(header && header.startsWith('Bearer')) {
      let userID = header.split(' ')[1]
      if (!userID || !userID==='') {
         console.log('no userID provided')
         return
      }
      let query = {_id: new ObjectId(userID)}
      const exists = await userSchema.find(query)
      // console.log(exists)
      if(exists) {
         req.loggedInUser = await userSchema.findById(userID).select('-pw')
         // console.log('req.user', req.loggedInUser)
         next()
      }
      else {
         res.status(401)
         throw Error('not an authorized user')
      }
   }
})

module.exports = {getLoggedinUser}