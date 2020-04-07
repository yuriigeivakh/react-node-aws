const { check } = require('express-validator');

exports.categoryCreateValidator = [
    check('name')
        .notEmpty()
        .withMessage('Name is required'),
    check('image')
        .notEmpty()
        .withMessage('Image required'),
    check('content')
        .isLength({min: 6})
        .withMessage('Content is required')
]

exports.categoryUpdateValidator = [
    check('name')
        .notEmpty()
        .withMessage('Name is required'),
    check('content')
        .isLength({min: 6})
        .withMessage('Content is required')
]