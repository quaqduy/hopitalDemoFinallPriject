const express = require('express');
const router = express.Router();

const PharmacistController = require('../controllers/PharmacistController');

router.get('/dashboard',PharmacistController.checkRole,PharmacistController.Dashboard);
router.post('/drugs', PharmacistController.checkRole,PharmacistController.createDrug);
router.post('/drugs/update/:id', PharmacistController.checkRole,PharmacistController.updateDrug);
router.post('/drugs/delete/:id', PharmacistController.checkRole,PharmacistController.deleteDrug);
router.get('/drugs/status/:id', PharmacistController.checkRole,PharmacistController.statusDrug);

const AuthController = require('../controllers/AuthController');
router.post('/dashboard/user/:type',PharmacistController.checkRole,AuthController.updateUserInfor);

module.exports = router;