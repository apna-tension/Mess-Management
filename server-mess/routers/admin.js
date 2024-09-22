const express = require('express');
const adminController = require('../controller/admin-controllers');
const router = express.Router();

const authMiddleware = require('../middleware/auth');

router.route('/').get(adminController.home);
router.route('/pending-users').get(authMiddleware, adminController.getPendingUsers);
router.route('/approve-user/:id').put(authMiddleware, adminController.approveUser);
router.route('/deny-user/:id').put(authMiddleware, adminController.denyUser);

module.exports = router;