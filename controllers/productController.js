const productModel = require('../models/product');

async function getAll(req, res) {
  const category = req.query.category;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const { products, total } = await productModel.getAllProducts(req.userId, category, skip, limit);
  
  res.json({
    products,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    totalItems: total,
    itemsPerPage: limit
  });
}

async function getById(req, res) {
  const product = await productModel.getProductById(req.params.id, req.userId);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
}

async function create(req, res) {
  const { name, description, price, category } = req.body;
  if (!name || !description || price == null || !category) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  const product = await productModel.createProduct({ name, description, price, category, user_id: req.userId });
  res.status(201).json(product);
}

async function update(req, res) {
  const { name, description, price, category } = req.body;
  if (!name || !description || price == null || !category) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  const product = await productModel.updateProduct(req.params.id, req.userId, { name, description, price, category });
  if (!product) return res.status(404).json({ message: 'Product not found or not owned by user' });
  res.json(product);
}

async function remove(req, res) {
  await productModel.deleteProduct(req.params.id, req.userId);
  res.status(204).send();
}

module.exports = { getAll, getById, create, update, remove }; 