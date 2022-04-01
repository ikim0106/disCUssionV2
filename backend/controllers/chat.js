const asyncHandler = require('express-async-handler')
const chatSchema = require('../databaseSchema/chatSchema')

const discuss = asyncHandler(async(req, res) => {
   // console.log('req', req)
   let { otherUserId } = req.body

   if(otherUserId==='' || !otherUserId) {
      console.log('no id provided')
      res.status(400)
      return
   }

   //find check if PM chatroom exists
   let otherUser = await chatSchema.find({
      //PMs of the current user
      is_group: false,
      users: {$elemMatch: {$eq: otherUserId}}
   })
   .populate('users', '-pw')
   .populate('last_message')

   console.log('otheruserid', otherUserId)
   console.log('currentuserid', req.loggedInUser._id.toString())

   let currentUser = await chatSchema.find({
      //PMs of the other user
      is_group: false,
      users: {$elemMatch: {$eq: req.loggedInUser._id}}
   })
   .populate('users', '-pw')
   .populate('last_message')
   
   currentUser = await chatSchema
   .populate(currentUser, {
      path: 'last_message.sender',
      select: 'displayName email avatar is_admin',
   })

   otherUser = await chatSchema
   .populate(otherUser, {
      path: 'last_message.sender',
      select: 'displayName email avatar is_admin',
   })

   console.log('otheruser', otherUser)
   console.log('currentuser', currentUser)
   
   // return

   let PM = undefined
   //classic for loop to compare chatrooms

   if(currentUser!==undefined && otherUser!==undefined){
      for(let i=0; i<otherUser.length; i++) {
         for(let j=0; j< currentUser.length; j++) {
            if(currentUser[j]===otherUser[i]) PM = currentUser[i]
            break
         }
      }
   }
   

   if(PM !== undefined && PM.length !== 0) {
      res.send(PM[0])
   }
   else {
      let newChatParams = {
         is_group: false,
         name: 'sender',
         users: [otherUserId, req.loggedInUser._id]
      }

      try{
         let newChat = await chatSchema.create(newChatParams)
         let bruh = await chatSchema.findOne({ 
            _id: newChat._id
         }).populate('users', '-pw')
         res.status(200)
         res.send(bruh)
      } catch(e) {
         console.log('error creating new chat', e)
         throw new Error(e.message)
      }
   }
})

module.exports = { discuss }