const express = require('express');
const { register, registerActivate } = require('../controllers/auth')
const { userRegisterValidators } = require('../validator/auth')
const { runValidation } = require('../validator')

const router = express.Router();

router.post('/register', userRegisterValidators, runValidation, register);

router.post('/register/activate', registerActivate);

module.exports = router;