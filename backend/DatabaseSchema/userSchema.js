/*
references
1. https://stackfame.com/mongodb-chat-schema-mongoose-chat-schema-chat-application
2. https://mongoosejs.com/docs/guide.html

Reference 1 and 2 was used as learning material.

This is a model to illustrate a user. It contains the traditional elements of a user
in most chat applications. All new users are defaulted to non-manager until another
manager makes them one.
*/

let mongoose = require('mongoose')
let Schema = mongoose.Schema

let userSchema = new Schema({
   display_name: {type: String, trim: true, required: true},
   is_admin: {type: Boolean, default: true},
   email: {type: String, required: true},
   pw: {type: String, required: true},
   avatar: {type: String,
      default: "https://img.icons8.com/external-flatart-icons-outline-flatarticons/64/000000/external-avatar-user-experience-flatart-icons-outline-flatarticons.png"},
},
{
   timestamps: true
})

let userModel = mongoose.model('userModel', userSchema)
module.exports = userModel