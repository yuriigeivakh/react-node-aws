const { check } = require('express-validator');

exports.linkCreateValidator = [
    check('title')
        .notEmpty()
        .withMessage('Title is required'),
    check('url')
        .notEmpty()
        .withMessage('Url is required'),
    check('categories')
        .notEmpty()
        .withMessage('Pick a category'),
    check('type')
        .notEmpty()
        .withMessage('Type free or paid'),
    check('medium')
        .notEmpty()
        .withMessage('Pick a medium video or book'),
]

exports.linkUpdateValidator = [
    check('title')
        .notEmpty()
        .withMessage('Title is required'),
    check('url')
        .notEmpty()
        .withMessage('Url is required'),
    check('categories')
        .notEmpty()
        .withMessage('Pick a category'),
    check('type')
        .notEmpty()
        .withMessage('Type free or paid'),
    check('medium')
        .notEmpty()
        .withMessage('Pick a medium video or book'),
]
