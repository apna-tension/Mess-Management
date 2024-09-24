const express = require('express');
const router = express.Router();
const managerController = require('../controller/manager-controllers');

const managerMiddleware = require('../middleware/manager');


router.route('/').get(managerController.home);
// router.route('/pending-deposit-request').get(managerMiddleware, managerController.getPendingDepositRequest);
router.route('/pending-deposits').get(managerMiddleware, managerController.getPendingDeposits);
router.route('/approve-deposit/:id').put(managerMiddleware, managerController.approveDeposit);
router.route('/deny-deposit/:id').put(managerMiddleware, managerController.denyDeposit);


module.exports = router;