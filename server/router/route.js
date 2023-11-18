const express = require('express');
const router = express.Router();
const controller = require('../controller/appController');
const Auth = require('../middlewar/auth');
const localVeriable = require('../middlewar/auth');
const registermail = require('../controller/nodemailer');

/**----GET METHOD----- */
router.get('/health-check', (req, res) => { res.send("OK"); });
router.get('/user/:username', controller.getUser);
router.get('/generateOTP', controller.verifyUser, localVeriable, controller.generateOTP);
router.get('/verifyOTP', controller.verifyOTP);
router.get('/createResetSession', controller.createResetSession);

/**----POST METHOD----- */
router.post('/register', controller.register);
router.post('/login', controller.verifyUser, controller.login);
router.post('/registermail', registermail);
router.post('/authenticate', (req, res) => { res.end(); });

/**----PUT METHOD----- */
router.put('/updateuser', Auth, controller.updateuser);
router.put('/resetpassword', controller.verifyUser, controller.resetpassword);

module.exports = router;
