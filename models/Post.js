const mongoose = require('mongoose');
const slugify = require('slugify');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  isGated: {
    type: Boolean,
    default: false
  },
  bgColor: {
    type: String,
    default: 'transparent'
  },
  tags: {
    type: [String],
    default: []
  }
}, { timestamps: true });

// Generate slug from title before saving
postSchema.pre('save', function(next) {
  if (this.title && this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model('Post', postSchema);
