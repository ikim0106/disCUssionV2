const router = require('express').Router()
const {loginAdmin, loginUser, signupUser, sendVerificationCode} = require('../controllers/users')

router.post('/login/admin', loginAdmin)
router.post('/login', loginUser)
router.route('/signup').post(signupUser)
router.post('/verificationEmail', sendVerificationCode)


module.exports = router