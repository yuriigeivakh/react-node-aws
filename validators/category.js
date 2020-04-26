const { check } = require('express-validator');

exports.categoryCreateValidator = [
    check('name')
        .notEmpty()
        .withMessage('Name is required'),
    check('image')
        .notEmpty()
        .withMessage('Image is required'),
    check('content')
        .isLength({min: 6})
        .withMessage('Content should be at least 6 character long')
]

exports.categoryUpdateValidator = [
    check('name')
        .notEmpty()
        .withMessage('Name is required'),
    check('content')
        .isLength({min: 6})
        .withMessage('Content is required')
]