const { Router } = require('express');
const authController = require('../controllers/authController');

const router = Router();

const { requireAuth } = require('../middlewares/authMiddleware');

router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);
router.get('/login', authController.login_get);
router.post('/login', authController.login_post);
router.get('/logout', authController.logout_get);
router.get('/profile', requireAuth, authController.profile_get);

module.exports = router;
