/*
references
1. https://stackfame.com/mongodb-chat-schema-mongoose-chat-schema-chat-application
2. https://github.com/theADAMJR/discord-chat
3. https://mongoosejs.com/docs/guide.html

Reference 1 and 3 was used as learning material.
The Discord-style embed logic was referenced from 2.

This is a model to illustrate every messasge sent by users. If it contains a link,
an embed will be displayed right below it, similar to a Discord embed; hence the 
contains_link parameter. Otherwise, it will just display plain text.
*/

let mongoose = require('mongoose')
let Schema = mongoose.Schema

let messageSchema = new Schema({
   sender: [{type: mongoose.Schema.Types.ObjectId, ref: 'userModel'}],
   send_in: [{type: mongoose.Schema.Types.ObjectId, ref: 'chatModel'}],
   contains_link: {type: Boolean, default: false},
   message: {type: String, contains_link: Boolean, trim: true},
},
{
   timestamps: true
})

let messageModel = mongoose.model('messageModel', messageSchema)
module.exports = messageModel