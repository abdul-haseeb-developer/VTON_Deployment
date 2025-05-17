// models/Product.js
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String, // URL to the product image
        required: true,
    },
    description: {
        type: String,
    },
    category: {
        type: String,
    },
    // MongoDB auto-generates '_id' field, no need for 'id'
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps

module.exports = mongoose.model('Product', ProductSchema);
