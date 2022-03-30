/*
References:
1. https://www.npmjs.com/package/express-async-handler
2. https://dev.to/ericchapman/nodejs-express-part-5-routes-and-controllers-55d3
3. https://expressjs.com/en/guide/error-handling.html
4. https://mongoosejs.com/docs/guide.html

*/
const userSchema = require('../databaseSchema/userSchema')
const asyncHandler = require('express-async-handler')

const loginAdmin = asyncHandler(async(req, res) => {
   const {email, password, is_admin} = req.body
})

const loginUser = asyncHandler(async(req, res) => {
   const {email, pw} = req.body
   const login = await userSchema.findOne({email, pw})
   if(!login) {
      res.status(401)
      throw Error('wrong email or password')
   }
   else { //correct info has been entered
      const userJSON = {
         _id: login._id, //mongoose auto-generated id
         email: login.email,
         pw: login.pw,
      }
      if(await login.checkPw(pw)){
         res.json(userJSON)
      }
      else {
         res.status(401)
         throw Error('wrong password')
      }
   }
})

const signupUser = asyncHandler(async (req, res) => {
   // console.log(req)
   let {displayName, email, pw, verified, avatar} = req.body
   let is_admin = false
   //all required except avatar, but it defaults to some random avatar I found online

   if (!email || !pw || !displayName) {
      //check if user entered all the required fields
      res.status(400)
      throw Error('some fields empty') //return? already sent error messages
   }
   if(!verified) {
      //
      res.status(400)
      throw Error('user is not email verified')
   }

   let search = await userSchema.findOne({email}) //only email is unique to each user, no need to check other variables
   if(search) {
      res.status(400)
      throw Error('user with given email exists')
   }
   else { //user does not exist, create a new user with the provided fields
      const newUser = await userSchema.create({displayName, is_admin, email, pw, verified, avatar})
      const newUserJSON = {
         _id: newUser._id, //mongoose auto-generated id
         displayName: newUser.displayName,
         email: newUser.email,
         pw: newUser.pw,
         verified: newUser.verified,
         avatar: newUser.avatar,
      }
      res.status(201).json(newUserJSON).send('new user successfully created')
   }
})

module.exports = { loginAdmin, loginUser, signupUser }