const express = require('express');
const adminController = require('../controller/admin-controllers');
const router = express.Router();

const adminMiddleware = require('../middleware/admin');

router.route('/').get(adminController.home);

// see all the pending users who is currently requesting to join the mess
router.route('/pending-users').get(adminMiddleware, adminController.getPendingUsers);

// approve the user who send the request
router.route('/approve-user/:id').put(adminMiddleware, adminController.approveUser);

// deny the request
router.route('/deny-user/:id').put(adminMiddleware, adminController.denyUser);

// see all the users who is already in the mess/all verified users
router.route('/approved-users').get(adminMiddleware, adminController.getApprovedUsers);

module.exports = router;