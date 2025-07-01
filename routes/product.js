const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const productController = require('../controllers/productController');
const pool = require('../models/db');

router.use(authenticateToken);

// Get all products (optionally filtered by ?category=)
router.get('/', productController.getAll);
// Get all categories
router.get('/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT category FROM products');
    const categories = result.rows.map(row => row.category);
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching categories' });
  }
});
// Get products by category (as path param)
router.get('/category/:category', async (req, res) => {
  try {
    const category = req.params.category;
    const result = await pool.query('SELECT * FROM products WHERE category = $1', [category]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products by category' });
  }
});
router.get('/:id', productController.getById);
router.post('/', productController.create);
router.put('/:id', productController.update);
router.delete('/:id', productController.remove);

module.exports = router; 