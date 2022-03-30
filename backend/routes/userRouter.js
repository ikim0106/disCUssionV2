const router = require('express').Router()
const {loginAdmin, loginUser, signupUser} = require('../controllers/users')

router.post('/login/admin', loginAdmin)
router.post('/login', loginUser)
router.route('/signup').post(signupUser)

module.exports = router