const express = require('express');
const { register } = require('../controllers/auth')
const { userRegisterValidators } = require('../validator/auth')
const { runValidation } = require('../validator')

const router = express.Router();

router.post('/register', userRegisterValidators, runValidation, register);

module.exports = router;