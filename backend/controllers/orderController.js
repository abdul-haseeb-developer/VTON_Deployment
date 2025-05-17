const asyncHandler = require('../middleware/asyncHandler');
const Order = require('../models/Order');

exports.createOrder = asyncHandler(async (req, res) => {
    const { items, shippingAddress, paymentMethod, totalAmount } = req.body;

    if (!items || items.length === 0) {
        res.status(400);
        throw new Error('No order items');
    }

    const order = new Order({
        user: req.user._id,
        items,
        shippingAddress,
        paymentMethod,
        totalAmount,
    });

    const createdOrder = await order.save();
    res.status(201).json({ order: createdOrder });
});
