const express = require('express');
const router = express.Router();
const managerController = require('../controller/manager-controllers');

const managerMiddleware = require('../middleware/manager');


router.route('/').get(managerController.home);

// manager of the mess see the pending deposit request
router.route('/pending-deposits').get(managerMiddleware, managerController.getPendingDeposits);

// manager approve the pending deposit request
router.route('/approve-deposit/:id').put(managerMiddleware, managerController.approveDeposit);

// manager deny the pending deposit request
router.route('/deny-deposit/:id').put(managerMiddleware, managerController.denyDeposit);


module.exports = router;