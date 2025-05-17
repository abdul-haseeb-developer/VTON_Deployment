const cloudinary = require('cloudinary').v2;
const asyncHandler = require('../middleware/asyncHandler');
const falService = require('../services/falService');
const Product = require('../models/Product'); // Assuming you have a Product model

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dll6sld3k',
  api_key: process.env.CLOUDINARY_API_KEY || '162356384773763',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'olSQ7b6ubETaPFf9HKU68aHEKgU',
});

/**
 * Get product details for preview before try-on
 * @route GET /api/vton/product-preview/:productId
 */
exports.getProductPreview = asyncHandler(async (req, res) => {
  const productId = req.params.productId;
  
  // Fetch product from database
  const product = await Product.findById(productId);
  
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  
  // Return product details including image URL and clothing type
  res.json({
    productId: product._id,
    productName: product.name,
    productImageUrl: product.imageUrl,
    category: product.category, // 'upper', 'lower', or 'full'
    description: product.description,
    price: product.price,
    
  });
});

/**
 * Upload user image for virtual try-on
 * @route POST /api/vton/upload-user-image
 */
exports.uploadUserImage = asyncHandler(async (req, res) => {
  // Check if file was uploaded
  if (!req.files || !req.files.userImage) {
    res.status(400);
    throw new Error('Please upload an image');
  }

  const userImage = req.files.userImage;
  
  // Validate file type
  if (!userImage.mimetype.startsWith('image')) {
    res.status(400);
    throw new Error('Please upload an image file');
  }

  // Upload to Cloudinary with folder structure
  try {
    const result = await cloudinary.uploader.upload(userImage.tempFilePath, {
      folder: `vton/users/${req.user._id}`,
      resource_type: 'image',
      transformation: [
        { width: 1024, height: 1024, crop: 'limit' }
      ]
    });

    // Return the secure URL
    res.json({
      success: true,
      imageUrl: result.secure_url,
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500);
    throw new Error('Image upload failed');
  }
});

/**
 * Process virtual try-on using Fal.ai API
 * @route POST /api/vton/process-vton
 */
exports.processVTON = asyncHandler(async (req, res) => {
  const { productImageUrl, userImageUrl, productId, category } = req.body;

  // Validate inputs
if (!productImageUrl || !userImageUrl || !category) {
    res.status(400);
    throw new Error('Product image URL, user image URL and cateory is required');
  }

  // If clothingType is not provided directly, fetch from product
  let finalcategory = category;
  if (!finalcategory && productId) {
    const product = await Product.findById(productId);
    if (product) {
      finalcategory = product.category;
    }
  }

  if (!finalcategory) {
    res.status(400);
    throw new Error('Clothing type is required');
  }

  try {
    // Validate if clothing type is valid
    if (!['upper', 'lower', 'overall'].includes(finalcategory.toLowerCase())) {
      res.status(400);
      throw new Error('Invalid clothing type. Must be upper, lower, or full');
    }

    // Call Fal.ai service to perform virtual try-on
    const resultImageUrl = await falService.callVTONApi(
      productImageUrl,
      userImageUrl,
      finalcategory
    );

    // Return the result
    res.json({
      success: true,
      resultImageUrl,
      productImageUrl,
      userImageUrl,
      category: finalcategory
    });
  } catch (error) {
    console.error('VTON processing error:', error);
    res.status(500);
    throw new Error(`Virtual try-on processing failed: ${error.message}`);
  }
});