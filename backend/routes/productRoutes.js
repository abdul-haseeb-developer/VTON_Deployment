const express = require('express');
const {
  getProductById,
  addProduct,
  getAllProducts,
  updateProduct, // ✅ Add this
  deleteProduct, // ✅ Add this
} = require('../controllers/productController');

const router = express.Router();

router.get('/', getAllProducts);         // ✅ GET /api/products (fetch all)
router.get('/:id', getProductById);       // GET /api/products/:id
router.post('/', addProduct);             // POST /api/products
router.put('/:id', updateProduct);       // ✅ PUT /api/products/:id (update)
router.delete('/:id', deleteProduct);   // ✅ DELETE /api/products/:id (delete)

module.exports = router;