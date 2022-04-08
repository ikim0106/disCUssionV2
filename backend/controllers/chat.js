/*
References: 
1. https://mongoosejs.com/docs/populate.html#field-selection
2. https://stackoverflow.com/questions/44879969/mongoose-how-to-exclude-id-from-populated
3. https://stackoverflow.com/questions/12096262/how-to-protect-the-password-field-in-mongoose-mongodb-so-it-wont-return-in-a-qu
4. https://love2dev.com/blog/javascript-remove-from-array/
5. https://stackoverflow.com/questions/5767325/how-can-i-remove-a-specific-item-from-an-array

Bits of code have been copied from these resources and modified to fit our project
*/

const asyncHandler = require('express-async-handler')
const chatSchema = require('../databaseSchema/chatSchema')
const userSchema = require('../databaseSchema/userSchema')
const messageSchema = require('../databaseSchema/messageSchema')

const discuss = asyncHandler(async(req, res) => {
   // console.log('req', req)
   let { otherUserId } = req.body

   if(otherUserId==='' || !otherUserId) {
      // console.log('no id provided')
      res.status(400)
      res.send('no id provided')
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

   // console.log('otheruserid', otherUserId)
   // console.log('currentuserid', req.loggedInUser._id.toString())

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

   // console.log('otheruser', otherUser)
   // console.log('currentuser', currentUser)
   
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
   
   // console.log('PM', PM)
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
         res.status(400)
         res.send('error creating PM')
         throw Error(e.message)
      }
   }
})

const makeGroup = asyncHandler(async(req, res) => {
   let content = req.body
   let selectedUsers = JSON.parse(content.users)
   let groupName = `${req.loggedInUser.displayName}'s group chat`
   if(content.name) {
      //if name is provided, set to that name, otherwise have a default group chat name
      groupName = content.name 
   }

   // console.log('groupName', groupName)
   // console.log(selectedUsers)
   if(!selectedUsers || selectedUsers.length < 2) {
      //defensive code to deal with a total of 1 or 2 users in a group
      res.status(400)
      res.send("Add two or more users to your group")
      return res
   }
   selectedUsers.push(req.loggedInUser) //need to add the logged in user to group as well

   const group = await chatSchema.create({
      is_group: true,
      name: groupName,
      users: selectedUsers,
      manager: req.loggedInUser,
   })
   
   if(!group) {
      res.status(400)
      res.send("error creating chat")
      return res
   }
   
   let groupID = group._id

   const removedPasswords = await chatSchema.findOne({_id: groupID})
      .populate('users', '-pw')
      .populate('manager', '-pw')
   
   res.status(200)
   res.json(removedPasswords)
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
      // console.log('currentuser', currentUser)
      res.status(200)
      res.send(currentUser)
   }
   else {
      // console.log('invalid userID')
      res.status(400)
      res.send('invalid userID')
      throw Error('invalid userID')
   }
   // const currentUser = chatSchema.find({})
   // console.log('currensUserID', bruh.loggedInUser)
})

const renameGroup = asyncHandler(async(req, res) => {
   let { toRenameChatID, toName } = req.body
   let managerID = req.loggedInUser._id

   // console.log(req.loggedInUser._id)
   let toRenameChat = await chatSchema.findOne({
      _id: toRenameChatID,
      is_group: true,
   })
   .populate('users', '-pw')
   .populate('manager', '-pw')
   .populate('last_message')
   toRenameChat = await userSchema.populate(toRenameChat, {
      path: "last_message.sender",
      select: "displayName email avatar is_admin"
   })
   
   if(!toRenameChat) {
      res.status(400)
      res.send('error renaming chat')
      return res
   }

   if(req.loggedInUser._id.toString() != toRenameChat.manager[0]._id.toString() && req.loggedInUser.is_admin===false) {
      res.status(400)
      res.send('You do not have the privileges to do that')
      return res
   }

   toRenameChat.name = toName
   // console.log('length', toRenameChat.length)
   await toRenameChat.save()

   console.log('renamed chat to', toRenameChat.name)
   res.status(200)
   res.json(toRenameChat)
})

const addToGroup = asyncHandler(async(req, res) => {
   let { toAddGroupID, toAddUserID } = req.body

   let toAddUser = await userSchema.findOne({ 
      _id: toAddUserID   
   })

   if(!toAddUser) {
      res.status(400)
      res.send('invalid user')
      return res
   }

   let toAddGroup = await chatSchema.findOne({
      _id: toAddGroupID,
      is_group: true,
   })
   .populate('users', '-pw')
   .populate('manager', '-pw')
   .populate('last_message')
   toAddGroup = await userSchema.populate(toAddGroup, {
      path: "last_message.sender",
      select: "displayName email avatar is_admin"
   })

   if(!toAddGroup) {
      res.status(400)
      res.send('error adding user to group chat')
      return res
   }

   let groupUsers = toAddGroup.users

   for(let i=0; i<groupUsers.length; i++) {
      // console.log(groupUsers[i]._id.toString(), toAddUser._id.toString())
      if(groupUsers[i]._id.toString() === toAddUser._id.toString()) {
         res.status(400)
         res.send('user already exists in group')
         return res
      }
   }

   //user is not in group already
   toAddGroup.users.push(toAddUser)
   await toAddGroup.save()

   res.status(200)
   res.send(toAddGroup)
})

const removeFromGroup = asyncHandler(async(req,res) => {
   let { toRemoveGroupID, toRemoveUserID} = req.body

   let toRemoveUser = await userSchema.findOne({
      _id: toRemoveUserID
   })

   if(!toRemoveUser) {
      res.status(400)
      res.send('invalid user')
      return res
   }

   let toRemoveGroup = await chatSchema.findOne({
      _id: toRemoveGroupID,
      is_group: true,
   })
   .populate('users', '-pw')
   .populate('manager', '-pw')
   .populate('last_message')
   toRemoveGroup = await userSchema.populate(toRemoveGroup, {
      path: "last_message.sender",
      select: "displayName email avatar is_admin"
   })

   if(!toRemoveGroup) {
      res.status(400)
      res.send('error getting the group to remove')
      return res
   }

   let groupUsers = toRemoveGroup.users
   let counter=0
   for(let i=0; i<groupUsers.length; i++) {
      if(groupUsers[i]._id.toString() === toRemoveUser._id.toString()) {
         // console.log(groupUsers[i]._id.toString(), toRemoveUser._id.toString())
         counter++
      }
   }
   if(counter===0) {
      res.status(400)
      res.send('user is not in the group')
      return res
   }

   toRemoveGroup.users = toRemoveGroup.users.filter(user=> user._id.toString() !== toRemoveUserID)
   // console.log(toRemoveGroup.users)
   if(toRemoveGroup.manager[0]._id.toString() === toRemoveUserID) {
      toRemoveGroup.manager[0] = toRemoveGroup.users[0]
      // console.log('changed manager to ', toRemoveGroup.manager[0])
   }
   await toRemoveGroup.save()
   res.status(200)
   res.send(toRemoveGroup.users)
   return res
})



module.exports = { 
   discuss, 
   getAllChatrooms, 
   makeGroup, 
   renameGroup, 
   addToGroup, 
   removeFromGroup
}