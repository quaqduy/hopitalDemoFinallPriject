const express = require('express');
const router = express.Router();

const AdminController = require('../controllers/AdminController');

router.get('/',AdminController.checkRole,AdminController.Dashboard);

router.post('/doctor/add',AdminController.checkRole,AdminController.AddDoctor);
router.get('/doctor/view/:id',AdminController.checkRole,AdminController.ViewDoctor);

router.post('/nurse/add',AdminController.checkRole,AdminController.AddNurse);
router.get('/nurse/view/:id',AdminController.checkRole,AdminController.ViewNurse);
router.post('/nurse/edit/:id',AdminController.checkRole,AdminController.EditNurse);

router.post('/pharmacist/add',AdminController.checkRole,AdminController.AddPharmacist);
router.get('/pharmacist/view/:id',AdminController.checkRole,AdminController.ViewPharmacist);

router.post('/receptionist/add',AdminController.checkRole,AdminController.AddReceptionist);
router.get('/receptionist/view/:id',AdminController.checkRole,AdminController.ViewReceptionist);
router.post('/receptionist/edit/:id',AdminController.checkRole,AdminController.EditReceptionist);

router.get('/surgery/status/:id/:value',AdminController.checkRole,AdminController.surgeryStatusHandle);
router.post('/surgery/surgeons/:id/',AdminController.checkRole,AdminController.setSurgeons);

router.post('/room/create',AdminController.checkRole,AdminController.createRoom);
router.post('/room/update/:id',AdminController.checkRole,AdminController.updateRoom);
router.get('/room/delete/:id',AdminController.checkRole,AdminController.deleteRoom);


module.exports = router;