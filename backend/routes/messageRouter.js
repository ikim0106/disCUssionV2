const { getLoggedinUser } = require('../middleware/logMiddleware')
const { send, fetch } = require('../controllers/message')

const router = require('express').Router()

router.route('/').post(getLoggedinUser, send)
router.route('/:id').get(getLoggedinUser, fetch)

module.exports = router