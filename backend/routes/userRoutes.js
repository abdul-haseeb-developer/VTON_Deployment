const express = require('express');
const router = express.Router();
const { getUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// GET /api/users/me
router.get('/me', protect, getUserProfile);

module.exports = router;
