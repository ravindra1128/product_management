const pool = require('./db');

async function getAllProducts(userId, category, skip = 0, limit = 10) {
  let baseQuery = 'FROM products WHERE user_id = $1';
  let params = [userId];
  
  if (category) {
    baseQuery += ' AND category = $2';
    params.push(category);
  }
  
  // Get total count
  const countQuery = `SELECT COUNT(*) ${baseQuery}`;
  const countRes = await pool.query(countQuery, params);
  const total = parseInt(countRes.rows[0].count);
  
  // Get paginated products
  const productsQuery = `SELECT * ${baseQuery} ORDER BY id DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(limit, skip);
  const productsRes = await pool.query(productsQuery, params);
  
  return {
    products: productsRes.rows,
    total
  };
}

async function getProductById(id, userId) {
  const res = await pool.query('SELECT * FROM products WHERE id = $1 AND user_id = $2', [id, userId]);
  return res.rows[0];
}

async function createProduct({ name, description, price, category, user_id }) {
  const res = await pool.query(
    'INSERT INTO products (name, description, price, category, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [name, description, price, category, user_id]
  );
  return res.rows[0];
}

async function updateProduct(id, userId, { name, description, price, category }) {
  const res = await pool.query(
    'UPDATE products SET name = $1, description = $2, price = $3, category = $4 WHERE id = $5 AND user_id = $6 RETURNING *',
    [name, description, price, category, id, userId]
  );
  return res.rows[0];
}

async function deleteProduct(id, userId) {
  await pool.query('DELETE FROM products WHERE id = $1 AND user_id = $2', [id, userId]);
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
}; 