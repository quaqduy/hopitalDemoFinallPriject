const express = require('express');
const router = express.Router();

const AdminController = require('../controllers/AdminController');

router.get('/',AdminController.Dashboard);

router.post('/doctor/add',AdminController.AddDoctor);
router.get('/doctor/view/:id',AdminController.ViewDoctor);

router.post('/nurse/add',AdminController.AddNurse);
router.get('/nurse/view/:id',AdminController.ViewNurse);
router.post('/nurse/edit/:id',AdminController.EditNurse);

router.post('/pharmacist/add',AdminController.AddPharmacist);
router.get('/pharmacist/view/:id',AdminController.ViewPharmacist);

router.post('/receptionist/add',AdminController.AddReceptionist);
router.get('/receptionist/view/:id',AdminController.ViewReceptionist);
router.post('/receptionist/edit/:id',AdminController.EditReceptionist);

module.exports = router;