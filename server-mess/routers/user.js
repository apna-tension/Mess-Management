// User Router
const express = require('express');
const userController = require('../controller/user-controllers');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// user can add money in the mess
router.route('/add-money').post(authMiddleware, userController.addMoney);

module.exports = router;