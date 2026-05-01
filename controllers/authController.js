const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Handle Errors
const handleErrors = (err) => {
  let errors = { username: '', email: '', password: '' };

  if (err.message === 'Incorrect email') {
    errors.email = 'That email is not registered';
  }

  if (err.message === 'Incorrect password') {
    errors.password = 'That password is incorrect';
  }

  if (err.code === 11000) {
    if (err.message.includes('email')) {
      errors.email = 'That email is already registered';
    }
    if (err.message.includes('username')) {
      errors.username = 'That username is already taken';
    }
    return errors;
  }

  if (err.message.includes('User validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: maxAge
  });
};

module.exports.signup_get = (req, res) => {
  res.render('signup', { title: 'Sign Up - The Mainframe' });
};

module.exports.login_get = (req, res) => {
  res.render('login', { title: 'Log In - The Mainframe' });
};

module.exports.signup_post = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.create({ username, email, password });
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      const auth = await user.comparePassword(password);
      if (auth) {
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user: user._id });
      } else {
        throw Error('Incorrect password');
      }
    } else {
      throw Error('Incorrect email');
    }
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
};

const Post = require('../models/Post');
module.exports.profile_get = async (req, res) => {
  try {
    const posts = await Post.find({ author: res.locals.user._id }).sort({ createdAt: -1 });
    res.render('profile', { title: 'User Profile - The Mainframe', posts });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
};
