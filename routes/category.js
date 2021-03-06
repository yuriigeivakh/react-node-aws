const express = require('express');
const router = express.Router();

const { create, update, list, read, remove } = require('../controllers/category')
const { requireSignIn, adminMiddleware } = require('../controllers/auth')
const { categoryCreateValidator, categoryUpdateValidator } = require('../validators/category')
const { runValidation } = require('../validators')

router.post('/category', categoryCreateValidator, runValidation, requireSignIn, adminMiddleware, create);

router.get('/categories', list);

router.post('/category/:slug', read);

router.put('/category/:slug', categoryUpdateValidator, runValidation, requireSignIn, adminMiddleware, update);

router.delete('/category/:slug', requireSignIn, adminMiddleware, remove);

module.exports = router;