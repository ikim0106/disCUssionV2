/*
References
1. https://javascript.hotexamples.com/zh/examples/%40pusher.chatkit-server/-/createUser/javascript-createuser-function-examples.html
2. https://www.freecodecamp.org/news/building-a-modern-chat-application-with-react-js-558896622194/
3. https://stackoverflow.com/questions/71108432/want-to-add-group-chat-functionality-in-my-chat-application-using-react-native-g

All of these resources have been used as learning material.
Bits of code have been copied from these resources and modified to fit our project.
*/

const router = require('express').Router()
const {getLoggedinUser} = require('../middleware/logMiddleware')
const {
   discuss, 
   getAllChatrooms, 
   makeGroup, 
   renameGroup,
   addToGroup,
   removeFromGroup
} = require('../controllers/chat')

router.route('/').get(getLoggedinUser, getAllChatrooms)
router.route('/').post(getLoggedinUser, discuss)
router.route('/makeGroup').post(getLoggedinUser, makeGroup)
router.route('/renameGroup').post(getLoggedinUser, renameGroup)
router.route('/addToGroup').post(getLoggedinUser, addToGroup)
router.route('/removeFromGroup').post(getLoggedinUser, removeFromGroup)
// router.route('/createGroupchat').post(getLoggedinUser, createGroupchat)

// router.route('/', getHistory)
// router.route('/renameGroupchat')
// router.route('/removeGroupchat')
// router.route('/invite')

module.exports = router