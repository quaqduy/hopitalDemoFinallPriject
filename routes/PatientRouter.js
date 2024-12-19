const express = require('express');
const router = express.Router();

const PatientController = require('../controllers/PatientController');

router.get('/dashboard',PatientController.Dashboard);

module.exports = router;