const { check } = require('express-validator');

exports.userRegisterValidators = [
    check('name')
        .notEmpty()
        .withMessage('Name is required'),
    check('email')
        .isEmail()
        .withMessage('Must be a valid email adress'),
    check('password')
        .isLength({min: 6})
        .withMessage('Password must be at least 6 characters long')
]