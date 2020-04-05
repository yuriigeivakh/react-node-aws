const express = require('express');
const router = express.Router();

const { register, registerActivate, login } = require('../controllers/auth')
const { userRegisterValidators, userLoginValidator } = require('../validator/auth')
const { runValidation } = require('../validator')

router.post('/register', userRegisterValidators, runValidation, register);

router.post('/register/activate', registerActivate);

router.post('/login', userLoginValidator, runValidation, login);

module.exports = router;