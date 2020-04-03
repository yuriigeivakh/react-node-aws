const express = require('express');
const { register, registerActivate, login } = require('../controllers/auth')
const { userRegisterValidators, userLoginValidator } = require('../validator/auth')
const { runValidation } = require('../validator')

const router = express.Router();

router.post('/register', userRegisterValidators, runValidation, register);

router.post('/register/activate', registerActivate);

router.post('/login', userLoginValidator, runValidation, login);

module.exports = router;