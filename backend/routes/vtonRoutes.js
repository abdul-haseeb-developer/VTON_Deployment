const express = require('express');
const router = express.Router();
const {
  uploadProductImage,
  uploadUserImage,
  processVTON,
  getProductPreview,
} = require('../controllers/vtonController');
const { protect } = require('../middleware/authMiddleware');

// Middleware for handling file uploads
const fileUpload = require('express-fileupload');
router.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
}));

// Protected routes
router.use(protect);

// Route to get product image for preview
router.get('/product-preview/:productId', getProductPreview);

// Route to upload user image
router.post('/upload-user-image', uploadUserImage);

// Route to process virtual try-on
router.post('/process-vton', processVTON);

module.exports = router;