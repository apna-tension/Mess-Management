const express = require('express');
const adminController = require('../controller/admin-controllers');
const router = express.Router();

const adminMiddleware = require('../middleware/admin');

router.route('/').get(adminController.home);
router.route('/pending-users').get(adminMiddleware, adminController.getPendingUsers);
router.route('/approve-user/:id').put(adminMiddleware, adminController.approveUser);
router.route('/deny-user/:id').put(adminMiddleware, adminController.denyUser);
router.route('/approved-users').get(adminMiddleware, adminController.getApprovedUsers);

module.exports = router;