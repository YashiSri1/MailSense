const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { getAuthUrl, getTokens } = require('../services/gmail/oauthService');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password });
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -googleTokens');
    if (user) {
      res.json({
        ...user.toObject(),
        hasGmailConnected: !!user.googleId
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Google Auth URL
// @route   GET /api/auth/google
// @access  Private
exports.getGoogleAuthUrl = async (req, res) => {
  try {
    const url = getAuthUrl(req.user._id);
    res.json({ url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Handle Google Auth Callback
// @route   GET /api/auth/google/callback
// @access  Public
exports.handleGoogleCallback = async (req, res) => {
  try {
    const { code, state } = req.query;
    if (!code || !state) {
      return res.redirect(`${process.env.FRONTEND_URL}/settings?gmail_connected=false&error=Missing parameters`);
    }

    const { tokens, profile } = await getTokens(code);
    
    // Update user with tokens and google info using state as userId
    const user = await User.findById(state);
    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/settings?gmail_connected=false&error=User not found`);
    }

    user.googleId = profile.id;
    user.googleTokens = tokens;
    
    if (!user.name && profile.name) user.name = profile.name;
    
    await user.save();

    res.redirect(`${process.env.FRONTEND_URL}/settings?gmail_connected=true`);
  } catch (error) {
    res.redirect(`${process.env.FRONTEND_URL}/settings?gmail_connected=false&error=${encodeURIComponent(error.message)}`);
  }
};

