const router = require('express').Router()
const {searchUser, loginAdmin, loginUser, signupUser, sendVerificationCode, changePassword} = require('../controllers/users')
const {getLoggedinUser} = require('../middleware/logMiddleware')

router.post('/login/admin', loginAdmin)
router.post('/login', loginUser)
router.route('/signup').post(signupUser)
router.route('/').get(getLoggedinUser, searchUser)
router.post('/verificationEmail', sendVerificationCode)
router.post('/changePassword', changePassword)


module.exports = router