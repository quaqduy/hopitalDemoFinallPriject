const express = require('express');
const router = express.Router();

const PatientController = require('../controllers/PatientController');

router.get('/dashboard',PatientController.checkRole,PatientController.Dashboard);
router.post('/dashboard/appointment',PatientController.checkRole,PatientController.makeAppointment);
router.post('/dashboard/user',PatientController.checkRole,PatientController.updateUserInfor);
router.get('/viewResult/:id',PatientController.checkRole,PatientController.viewResult);
router.post('/dashboard/surgery',PatientController.checkRole,PatientController.makeSurgery);

router.post('/room/register',PatientController.checkRole,PatientController.roomRegister);

module.exports = router;