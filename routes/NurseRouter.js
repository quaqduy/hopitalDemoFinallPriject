const express = require('express');
const router = express.Router();

const NurseController = require('../controllers/NurseController');

router.get('/dashboard',NurseController.checkRole,NurseController.Dashboard);
router.get('/room/requestAccept/:id',NurseController.checkRole,NurseController.acceptRequest);
router.get('/room/requestCancel/:id',NurseController.checkRole,NurseController.cancelRequest);
router.post('/patient/update-condition',NurseController.checkRole,NurseController.updateDescription);
router.get('/patient/update-status/:id',NurseController.checkRole,NurseController.updateStatus);

const AuthController = require('../controllers/AuthController');
router.post('/dashboard/user/:type',NurseController.checkRole,AuthController.updateUserInfor);

module.exports = router;