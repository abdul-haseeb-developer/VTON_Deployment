const axios = require('axios');
const {fal}  = require("@fal-ai/client");

fal.config({
  credentials: process.env.FAL_AI_API_KEY, // Using the key from .env
});

/**
 * Call the Fal.ai CAT VTON API to perform virtual try-on
 * 
 * @param {string} productImageUrl - URL of the product image from Cloudinary
 * @param {string} userImageUrl - URL of the user's image from Cloudinary
 * @param {string} category - Type of clothing (upper, lower, full)
 * @returns {Promise<string>} - URL of the resulting try-on image
 */
exports.callVTONApi = async (productImageUrl, userImageUrl, category) => {
  try {
    // Validate inputs
    if (!productImageUrl || !userImageUrl || !category) {
      throw new Error('Missing required parameters: productImageUrl, userImageUrl, or clothingType');
    }
    console.log("category")
    console.log(category)

    // Validate clothing type
    if (!['upper', 'lower', 'overall'].includes(category.toLowerCase())) {
      throw new Error('Invalid clothing type. Must be upper, lower, or overall');
    }

    console.log('Calling Fal.ai CAT VTON API with params:', {
      human_image_url: userImageUrl,
      garment_image_url: productImageUrl,
      cloth_type: category.toLowerCase()
    });

    // Fal.ai API endpoint for CAT VTON
    const FAL_API_URL = 'https://api.fal.ai/v1/models/cat-vton'; 

    // const FAL_API_URL = 'https://fal.ai/models/fal-ai/cat-vton'; testing
                         
    const FAL_API_KEY = process.env.FAL_AI_API_KEY || 'e624dabd-1b9a-409f-86dc-caf984e93bd1:c549f3790d2b9be44d2d60eab15b587e'; // Use environment variable

    // Make the API request
    // const response = await axios.post(
    //   FAL_API_URL,
    //   {
    //     human_image_url: userImageUrl,
    //     garment_image_url: productImageUrl,
    //     cloth_type: category.toLowerCase(),
    //   },
    //   {
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': `Key ${FAL_API_KEY}`,
    //     },
    //     timeout: 60000, // 60 seconds timeout for longer processing
    //   }
    // );
    //   console.log('response');
    //   console.log(response)
    // Check if we have a valid response with image URL
    // if (response.data && response.data.image && response.data.image.url) {
    //   return response.data.image.url; // Return the result image URL
    // } else {
    //   throw new Error('Invalid response from Fal.ai API');
    // }


    console.log(userImageUrl)
    console.log(productImageUrl)
    console.log(category)

    const response = await fal.subscribe("fal-ai/cat-vton", {
  input: {
         human_image_url: userImageUrl,
        garment_image_url: productImageUrl,
        cloth_type: category.toLowerCase(),
  },
  logs: true,
  onQueueUpdate: (update) => {
    if (update.status === "IN_PROGRESS") {
      update.logs.map((log) => log.message).forEach(console.log);
    }
  },
});
console.log(response.data);
console.log(response.requestId);

     if (response.data && response.data.image && response.data.image.url) {
      return response.data.image.url; // Return the result image URL
    } else {
      throw new Error('Invalid response from Fal.ai API');
    }
  } catch (error) {
    console.error('Error calling Fal.ai API:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Validate if the product image is suitable for try-on
 * This can be expanded to include additional checks
 * 
 * @param {string} imageUrl - URL of the image to validate
 * @returns {Promise<boolean>} - Whether the image is valid
 */
exports.validateProductImage = async (imageUrl) => {
  try {
    // You could add logic here to verify image quality, size, etc.
    // For now, we'll just check if the URL is accessible
    const response = await axios.head(imageUrl);
    return response.status === 200;
  } catch (error) {
    console.error('Error validating product image:', error.message);
    return false;
  }
};