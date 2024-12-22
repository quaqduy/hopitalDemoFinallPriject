const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/AuthController');
const validate = require('../helper/validate');

router.get('/signIn',AuthController.signIn);
router.post('/signIn',validate.validateLogin ,AuthController.signInAction);
router.get('/signUp',AuthController.signUp);
router.post('/signUp',validate.validateRegister ,AuthController.signUpAction);
router.get('/logout',validate.validateRegister ,AuthController.logout);

module.exports = router;