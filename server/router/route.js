const express = require('express')
const router = express.Router()
const controller = require('../controller/appController')
const Auth = require('../middlewar/auth')
const localVeriable = require('../middlewar/auth')
const registermail = require('../controller/nodemailer')

/**----GET METHOD----- */
router.route('/health-check').get((req, res) => { res.send("OK") })
router.route('/user/:username').get(controller.getUser)
router.route('/generateOTP').get(controller.verifyUser, localVeriable, controller.generateOTP)
router.route('/verifyOTP').get(controller.verifyOTP)
router.route('/createResetSession').get(controller.createResetSession)

/**----POST METHOD----- */
router.route('/register').post(controller.register)
router.route('/login').post(controller.verifyUser, controller.login)
router.route('/registermail').post(registermail)
router.route('/authenticate').post((req, res) => { res.end() })


/**----PUT METHOD----- */
router.route('/updateuser').put(Auth, controller.updateuser)
router.route('/resetpassword').put(controller.verifyUser, controller.resetpassword)


module.exports = router