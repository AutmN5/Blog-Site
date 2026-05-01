const Post = require('../models/Post');

module.exports.home_get = async (req, res) => {
  try {
    const search = req.query.search || '';
    let query = {
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ]
    };
    
    // Privacy logic: show public OR if logged in, public + own private
    if (res.locals.user) {
      query = {
        $and: [
          query,
          { $or: [{ isPrivate: false }, { author: res.locals.user._id }] }
        ]
      };
    } else {
      query = {
        $and: [
          query,
          { isPrivate: false }
        ]
      };
    }

    const posts = await Post.find(query).populate('author', 'username').sort({ createdAt: -1 });
    res.render('home', { title: 'Home - The Mainframe', posts, searchQuery: search });
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
    
    // Check privacy
    if (post.isPrivate) {
      if (!res.locals.user || res.locals.user._id.toString() !== post.author._id.toString()) {
        return res.status(403).render('404', { title: 'Access Denied' }); // Show 404 to hide existence
      }
    }
    
    const description = post.content.substring(0, 150) + '...';
    const og = { title: post.title, description: description };
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "author": { "@type": "Person", "name": post.author.username },
      "datePublished": post.createdAt,
      "description": description
    };
    
    res.render('post', { title: `${post.title} - The Mainframe`, post, og, jsonLd });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
};

module.exports.create_post_get = (req, res) => {
  res.render('create', { title: 'Create New Post - The Mainframe' });
};

module.exports.create_post_post = async (req, res) => {
  const { title, content, isPrivate, isGated, bgColor, textColor, titleColor, borderColor, tags } = req.body;
  
  // Parse tags
  let parsedTags = [];
  if (tags) {
    parsedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
  }

  try {
    const post = await Post.create({
      title,
      content,
      author: res.locals.user._id,
      isPrivate: isPrivate === 'on' || isPrivate === true,
      isGated: isGated === 'on' || isGated === true,
      bgColor: bgColor || 'transparent',
      textColor: textColor || '#f8f9fa',
      titleColor: titleColor || '#ffffff',
      borderColor: borderColor || '#333333',
      tags: parsedTags
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

module.exports.edit_post_get = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).render('404', { title: 'Post Not Found' });
    if (post.author.toString() !== res.locals.user._id.toString()) return res.status(403).render('404', { title: 'Access Denied' });
    res.render('edit', { title: `Edit ${post.title} - The Mainframe`, post });
  } catch(err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
};

module.exports.edit_post_post = async (req, res) => {
  const { title, content, isPrivate, isGated, bgColor, textColor, titleColor, borderColor, tags } = req.body;
  let parsedTags = [];
  if (tags) {
    parsedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
  }
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).send('Not Found');
    if (post.author.toString() !== res.locals.user._id.toString()) return res.status(403).send('Forbidden');
    
    post.title = title;
    post.content = content;
    post.isPrivate = isPrivate === 'on' || isPrivate === true;
    post.isGated = isGated === 'on' || isGated === true;
    post.bgColor = bgColor || 'transparent';
    post.textColor = textColor || '#f8f9fa';
    post.titleColor = titleColor || '#ffffff';
    post.borderColor = borderColor || '#333333';
    post.tags = parsedTags;
    await post.save();
    
    res.redirect(`/posts/${post.slug}`);
  } catch(err) {
    console.log(err);
    res.status(400).send('Error updating post');
  }
};

module.exports.rss_get = async (req, res) => {
  try {
    const posts = await Post.find({ isPrivate: false }).sort({ createdAt: -1 }).limit(20).populate('author', 'username');
    const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
  <title>The Mainframe</title>
  <link>https://yourdomain.com</link>
  <description>Insights, tutorials, and stories from a full-stack developer.</description>
  ${posts.map(p => `
  <item>
    <title><![CDATA[${p.title}]]></title>
    <link>https://yourdomain.com/posts/${p.slug}</link>
    <description><![CDATA[${p.content.substring(0, 200)}...]]></description>
    <pubDate>${new Date(p.createdAt).toUTCString()}</pubDate>
  </item>`).join('')}
</channel>
</rss>`;
    res.set('Content-Type', 'text/xml');
    res.send(rss);
  } catch (err) {
    console.log(err);
    res.status(500).send('Error generating RSS');
  }
};
