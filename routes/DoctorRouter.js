const express = require('express');
const router = express.Router();

const DoctorController = require('../controllers/DoctorController');

router.get('/dashboard',DoctorController.checkRole,DoctorController.Dashboard);
router.get('/dashboard/appointment/accept/:id',DoctorController.checkRole,DoctorController.acceptAppointment);
router.get('/dashboard/appointment/cancel/:id',DoctorController.checkRole,DoctorController.cancelAppointment);
router.get('/dashboard/appointment/complete/:id',DoctorController.checkRole,DoctorController.completeAppointment);
router.get('/viewResultPage/:id',DoctorController.checkRole,DoctorController.viewResult);
router.post('/viewResultPage/:id',DoctorController.checkRole,DoctorController.saveResult);
router.post('/viewResultPage/drugs/:id',DoctorController.checkRole,DoctorController.saveDrug);

router.get('/surgery/status/:id/:value',DoctorController.checkRole,DoctorController.surgeryStatusHandle);

const AuthController = require('../controllers/AuthController');
router.post('/dashboard/user/:type',DoctorController.checkRole,AuthController.updateUserInfor);

module.exports = router;