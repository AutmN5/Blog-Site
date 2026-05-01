const Post = require('../models/Post');

module.exports.home_get = async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'username').sort({ createdAt: -1 });
    res.render('home', { title: 'Home - Avirup Mondal Blog', posts });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
};

module.exports.post_details_get = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug }).populate('author', 'username');
    if (!post) {
      return res.status(404).render('404', { title: 'Post Not Found' });
    }
    res.render('post', { title: `${post.title} - Avirup Mondal Blog`, post });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
};

module.exports.create_post_get = (req, res) => {
  res.render('create', { title: 'Create New Post - Avirup Mondal Blog' });
};

module.exports.create_post_post = async (req, res) => {
  const { title, content } = req.body;
  try {
    const post = await Post.create({
      title,
      content,
      author: res.locals.user._id
    });
    res.redirect(`/posts/${post.slug}`);
  } catch (err) {
    console.log(err);
    res.status(400).send('Error creating post');
  }
};

module.exports.delete_post = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    if (post.author.toString() !== res.locals.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    await Post.findByIdAndDelete(req.params.id);
    res.json({ redirect: '/' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Server error' });
  }
};
