/*
References
1. https://stackfame.com/mongodb-chat-schema-mongoose-chat-schema-chat-application
2. https://stackoverflow.com/questions/26936645/mongoose-private-chat-message-model
3. https://mongoosejs.com/docs/guide.html

All these resources were used as learning materials. The general structure of this
mongoose schema was taken from these resources.
A chat can either be a one-on-one chat or a chat with 3 or more people, is_group
differentiates the two. In a group chat, the chat creator is a manager of that chat
otherwise, there will be no admin.
This module is exported to be used by other modules.
*/

let mongoose = require('mongoose')
let Schema = mongoose.Schema

let chatroomSchema = new Schema({
   is_group: {type: Boolean, default: false},
   name: {type: String},
   users: [{type: mongoose.Schema.Types.ObjectId, ref: 'userModel'}],
   manager: [{type: mongoose.Schema.Types.ObjectId, ref: 'userModel'}],
   last_message: [{type: mongoose.Schema.Types.ObjectId, ref: 'messageModel'}]
},
{
   timestamps: true
})

let chatroomModel = mongoose.model('chatroomModel', chatroomSchema)
module.exports = chatroomModel