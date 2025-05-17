const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('./asyncHandler');

// Protect route - middleware to verify JWT and user
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if the token is in the Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from Authorization header
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using the JWT_SECRET from environment variables
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request object
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        // If no user found after decoding, throw error
        res.status(401);
        throw new Error('Not authorized, user not found');
      }

      // Move to next middleware or route handler
      next();
    } catch (error) {
      console.error(error);

      // Handle cases where the token is invalid or expired
      if (error.name === 'TokenExpiredError') {
        res.status(401);
        throw new Error('Not authorized, token has expired');
      }

      // Handle any other JWT errors
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  // If there's no token in the Authorization header, throw error
  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

module.exports = { protect };
