const express = require('express');
const router = express.Router();

const StartRouter = require('./StartRouter');
const AdminRouter = require('./AdminRouter');
const AccountRouter = require('./AccountRouter');
const PatientRouter = require('./PatientRouter');

//Start
router.use('/', StartRouter);
//SignIn_Up
router.use('/', AccountRouter);
//Admin
router.use('/admin', AdminRouter);
//patient
router.use('/patient', PatientRouter);

module.exports = router;