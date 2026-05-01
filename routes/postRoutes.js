const { Router } = require('express');
const postController = require('../controllers/postController');
const { requireAuth } = require('../middlewares/authMiddleware');

const router = Router();

router.get('/', postController.home_get);
router.get('/create', requireAuth, postController.create_post_get);
router.post('/create', requireAuth, postController.create_post_post);
router.get('/posts/:slug', postController.post_details_get);
router.delete('/posts/:id', requireAuth, postController.delete_post);

module.exports = router;
