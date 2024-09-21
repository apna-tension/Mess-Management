const express = require('express');
const authController = require('../controller/auth-controllers');
const router = express.Router();
const {loginSchema, registerSchema} = require('../validate/auth-validator');
const {validate} = require('../middleware/validate');
const authMiddleware = require('../middleware/auth');


// default page 
router.route('/').get(authController.home);

// Register user
router.route('/register').post(validate(registerSchema), authController.register);

// Login user
router.route('/login').post(validate(loginSchema), authController.login);

// verify-email while registering
router.route('/verify-email').post(authController.verifyEmail);

// Get user
router.route('/user').get(authMiddleware ,authController.getUser);

// verify-email while login
router.route('/verify-login').post(authController.verifyLogin);

// export router
module.exports = router;
