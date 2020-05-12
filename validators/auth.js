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
        .withMessage('Password must be at least 6 characters long'),
    check('categories')
        .isLength({min: 6})
        .withMessage('Pick at least one category'),
]

exports.userLoginValidator = [
    check('email')
        .isEmail()
        .withMessage('Must be a valid email adress'),
    check('password')
        .isLength({min: 6})
        .withMessage('Password must be at least 6 characters long')
]

exports.forgotPasswordValidator = [
    check('email')
        .isEmail()
        .withMessage('Must be a valid email adress'),
]

exports.resetPasswordValidator = [
    check('newPassword')
        .isLength({min: 6})
        .withMessage('Password must be at least 6 characters long'),
    check('resetPasswordLink')
        .notEmpty()
        .withMessage('Token is required')
]