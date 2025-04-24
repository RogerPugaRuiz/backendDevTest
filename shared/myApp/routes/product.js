const express = require('express');
const router = express.Router();
const { getSimilarProducts } = require('../service/product.service');

// GET /product/:productId/similar
router.get('/:productId/similar', async function(req, res) {
  const { productId } = req.params;
  try {
    const results = await getSimilarProducts(productId);
    if (!results || results.length === 0) {
      return res.status(404).json({ message: 'Product Not found' });
    }
    res.json(results);
  } catch (err) {
    res.status(404).json({ message: 'Product Not found' });
  }
});

module.exports = router;
