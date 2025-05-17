const express = require('express');
const router = express.Router();
const {
    getUserCart,
    addItemToCart,
    updateCartItem,
    removeItemFromCart,
    clearCart,
} = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

// All cart routes are protected
router.use(protect); 

router.get('/', getUserCart);
router.post('/items', addItemToCart);
router.put('/items/:productId', updateCartItem);
router.delete('/items/:productId', removeItemFromCart);
router.delete('/', clearCart);

module.exports = router;
