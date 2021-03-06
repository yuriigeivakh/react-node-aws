const express = require('express');
const router = express.Router();

const { register, registerActivate, login, forgotPassword, resetPassword } = require('../controllers/auth')
const { userRegisterValidators, userLoginValidator, resetPasswordValidator, forgotPasswordValidator } = require('../validators/auth')
const { runValidation } = require('../validators')

router.post('/register', userRegisterValidators, runValidation, register);

router.post('/register/activate', registerActivate);

router.post('/login', userLoginValidator, runValidation, login);

router.put('/forgot-password', forgotPasswordValidator, runValidation, forgotPassword);

router.put('/reset-password', resetPasswordValidator, runValidation, resetPassword);

module.exports = router;