/*
References:
1. https://www.npmjs.com/package/express-async-handler
2. https://dev.to/ericchapman/nodejs-express-part-5-routes-and-controllers-55d3
3. https://expressjs.com/en/guide/error-handling.html
4. https://mongoosejs.com/docs/guide.html
5. https://www.npmjs.com/package/mailgun.js
6. https://www.digitalocean.com/community/tutorials/how-to-perform-full-text-search-in-mongodb
7. https://www.mongodb.com/docs/manual/tutorial/query-documents/
8. https://www.mongodb.com/docs/manual/reference/operator/query/or/
9. https://www.mongodb.com/docs/manual/reference/operator/query/ne/
10. https://stackoverflow.com/questions/7878557/cant-find-documents-searching-by-objectid-using-mongoose
11. https://stackoverflow.com/questions/12096262/how-to-protect-the-password-field-in-mongoose-mongodb-so-it-wont-return-in-a-qu

*/
const userSchema = require('../databaseSchema/userSchema')
const asyncHandler = require('express-async-handler')
const konfig = require('../../config.json')
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
   service: 'gmail',
   auth: {
      user: konfig.nodemailerEmail,
      pass: konfig.nodemailerPW
   }
})

const sendVerificationCode = asyncHandler(async (req, res) => {
   console.log(req.body)
   const {email, rando} = req.body
   if(!email) {
      res.status(400)
      throw new Error("no email provided")
   } else {
      res.status(201).json({
         email: email,
         rando: rando
      })
   }

   const mailOptions = {
      from: 'disCUssion',
      to: email,
      subject: 'disCUssion verification code',
      html: `Your verification code is ${rando}`,
   }

   transporter.sendMail(mailOptions, (err, msg) => {
      if(err) {
         res.json(err)
      }
      else {
         console.log('mail sent!', msg)
         res.json(msg)
      }
   })
})

const searchUser = asyncHandler(async (req, res) => {
   let searchParams = req.query.search
   let searchRegEx = new RegExp(searchParams, 'i') //regex for searching email/displayName
   const query = searchParams ? {
      $or: [
         { displayName: {$regex: searchRegEx}},
         { email: {$regex: searchRegEx}},
      ]
   } : {}
   // console.log('query', searchParams)
   // console.log('request', req.user)
   const searchedUsers = await userSchema.find(query)
   .find({
      _id: {
         $ne: req.loggedInUser._id
      }
   })
   console.log('searchedUsers', searchedUsers)
})

// const mgKey = konfig.mailgunKey
// const formData = require('form-data')
// const Mailgun = require('mailgun.js')
// const mailgun= new Mailgun(formData)
// const mg = mailgun.client({
//    username: 'api',
//    key: mgKey
// })

// const sendVerificationCode = asyncHandler(async (req, res) => {
//    console.log(req.body)
//    const {email, rando} = req.body
//    if(!email) {
//       res.status(400)
//       throw new Error("No email provided")
//    } else {
//       res.status(201).json({
//          email: email,
//          rando: rando
//       })
//    }

//    const messageParams = {
//       from: "disCUssion <discussion@sandbox95b082d195f24a0ca4e54e41e2a11c73.mailgun.org>",
//       to: [email],
//       subject: "disCUssion Verification Code",
//       text: rando
//    }
//    mg.messages.create("sandbox95b082d195f24a0ca4e54e41e2a11c73.mailgun.org", messageParams)
// })

const loginAdmin = asyncHandler(async(req, res) => {
   const {email, password, is_admin} = req.body
})

const loginUser = asyncHandler(async(req, res) => {
   const {email, pw, is_admin} = req.body
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
         is_admin: login.is_admin,
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
      res.status(201).json(newUserJSON)
   }
})

module.exports = { loginAdmin, loginUser, signupUser, sendVerificationCode, searchUser }