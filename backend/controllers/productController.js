const Product = require('../models/Product');
const asyncHandler = require('../middleware/asyncHandler');

// @desc Get product by ID
exports.getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json(product);
});

// @desc Get all products
// @route GET /api/products
exports.getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// @desc Add a new product
exports.addProduct = asyncHandler(async (req, res) => {
  const { name, price, image, description, category } = req.body;

  if (!name || !price || !image) {
    res.status(400);
    throw new Error('Missing required fields: name, price, image');
  }

  const newProduct = new Product({
    name,
    price,
    image,
    description,
    category,
  });

  const createdProduct = await newProduct.save();
  res.status(201).json(createdProduct);
});

// @desc Update a product by ID
// @route PUT /api/products/:id
exports.updateProduct = asyncHandler(async (req, res) => {
  const { name, price, image, description, category } = req.body;

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { name, price, image, description, category },
    { new: true, runValidators: true } // 'new: true' returns the updated document
  );

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json(product);
});

// @desc Delete a product by ID
// @route DELETE /api/products/:id
exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.status(204).send(); // No content on successful deletion
  // Or you could send a success message:
  // res.json({ message: 'Product deleted successfully' });
});