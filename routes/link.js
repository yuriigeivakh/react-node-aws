const express = require('express');
const router = express.Router();

const { create, update, list, read, remove, clickCount, popular, popularInCategory } = require('../controllers/link');
const { requireSignIn, authMiddleware, adminMiddleware } = require('../controllers/auth');
const { canUpdateDeleteLink } = require('../middlewares/canUpdateDeleteLink');
const { linkCreateValidator, linkUpdateValidator } = require('../validators/link');
const { runValidation } = require('../validators');

router.post('/link', linkCreateValidator, runValidation, requireSignIn, authMiddleware, create);

router.post('/links', requireSignIn, adminMiddleware, list);

router.put('/click-count', clickCount);

router.get('/link/popular', popular);
router.get('/link/:id', read);
router.get('/link/popular/:category', popularInCategory);

router.put('/link/:id', linkUpdateValidator, runValidation, requireSignIn, authMiddleware, canUpdateDeleteLink, update);
router.put('/link/admin/:id', linkUpdateValidator, runValidation, requireSignIn, adminMiddleware, update);

router.delete('/link/:id', requireSignIn, authMiddleware, canUpdateDeleteLink, remove);
router.delete('/link/admin/:id', requireSignIn, adminMiddleware, remove);

module.exports = router;