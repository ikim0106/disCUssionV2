/*
References: 
1. https://mongoosejs.com/docs/populate.html#field-selection
*/

const asyncHandler = require('express-async-handler')
const chatSchema = require('../databaseSchema/chatSchema')
const userSchema = require('../databaseSchema/userSchema')
const messageSchema = require('../databaseSchema/messageSchema')

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
   
   currentUser = await userSchema
   .populate(currentUser, {
      path: 'last_message.sender',
      select: 'displayName email avatar is_admin',
   })

   otherUser = await userSchema
   .populate(otherUser, {
      path: 'last_message.sender',
      select: 'displayName email avatar is_admin',
   })

   console.log('otheruser', otherUser)
   console.log('currentuser', currentUser)
   
   let PM = undefined
   // return

   //classic nested for loop to compare chatrooms something like this can be handled in the database/mongoose, but i guess our host can handle this type of simple computation
   if(currentUser!==undefined && otherUser!==undefined){
      for(let i=0; i<otherUser.length; i++) {
         for(let j=0; j< currentUser.length; j++) {
            if(currentUser[j].users._id===otherUser[i].users._id) PM = currentUser[i]
            break
         }
      }
   }
   
   console.log('PM', PM)
   // return

   if(PM !== undefined && PM.length !== 0) {
      res.send(PM)
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
         throw Error(e.message)
      }
   }
})

const getAllChatrooms = asyncHandler(async(req, res) => {
   let currentUserID = req.loggedInUser._id
   let currentUser = await chatSchema.find({users: {$elemMatch: {$eq: currentUserID}}})
      .populate('users', '-pw')
      .populate('manager', '-pw')
      .populate('last_message')
      .sort({updatedAt: -1}) //sort from new to old PMs
   currentUser = await userSchema.populate(currentUser,  {
      path: "last_message.sender",
      select: "displayName email avatar is_admin"
   })
   if(currentUser!=undefined && currentUser.length>0) {
      console.log('currentuser', currentUser)
      res.status(200)
      res.send(currentUser)
   }
   else {
      console.log('invalid userID')
      res.status(400)
      throw Error('invalid userID')
      return
   }


   // const currentUser = chatSchema.find({})

   // console.log('currensUserID', bruh.loggedInUser)
})

module.exports = { discuss, getAllChatrooms }