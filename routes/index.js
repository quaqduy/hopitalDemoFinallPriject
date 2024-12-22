const express = require('express');
const router = express.Router();

const StartRouter = require('./StartRouter');
const AdminRouter = require('./AdminRouter');
const AccountRouter = require('./AccountRouter');
const PatientRouter = require('./PatientRouter');
const DoctorRouter = require('./DoctorRouter');
const PharmacistRouter = require('./PharmacistRouter');
const NurseRouter = require('./NurseRouter');

//Start
router.use('/', StartRouter);
//SignIn_Up
router.use('/', AccountRouter);
//Admin
router.use('/admin', AdminRouter);
//patient
router.use('/patient', PatientRouter);
//doctor
router.use('/doctor', DoctorRouter);

//pharmacist
router.use('/pharmacist',PharmacistRouter);

//nurse
router.use('/nurse',NurseRouter);

module.exports = router;