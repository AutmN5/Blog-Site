const { Router } = require('express');
const adminController = require('../controllers/adminController');
const { requireAuth, requireAdmin } = require('../middlewares/authMiddleware');

const router = Router();

router.get('/admin', requireAuth, requireAdmin, adminController.admin_get);
router.delete('/admin/users/:id', requireAuth, requireAdmin, adminController.admin_delete_user);
router.delete('/admin/posts/:id', requireAuth, requireAdmin, adminController.admin_delete_post);

module.exports = router;
