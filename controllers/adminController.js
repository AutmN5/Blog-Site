const User = require('../models/User');
const Post = require('../models/Post');

module.exports.admin_get = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    const posts = await Post.find().sort({ createdAt: -1 }).populate('author', 'username');
    res.render('admin', { title: 'Admin Override - The Mainframe', users, posts });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

module.exports.admin_delete_user = async (req, res) => {
  try {
    const userId = req.params.id;
    // Don't let admin delete themselves
    if (userId === res.locals.user._id.toString()) {
      return res.status(400).json({ error: 'Cannot delete own admin account' });
    }
    
    // Delete all posts by this user
    await Post.deleteMany({ author: userId });
    
    // Delete the user
    await User.findByIdAndDelete(userId);
    
    res.json({ redirect: '/admin' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

module.exports.admin_delete_post = async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ redirect: '/admin' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete post' });
  }
};
