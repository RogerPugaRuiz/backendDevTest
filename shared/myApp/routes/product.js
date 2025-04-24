const express = require('express');
const router = express.Router();
const { getSimilarProducts } = require('../service/product.service');

// GET /product/:productId/similar
router.get('/:productId/similar', async function(req, res) {
  const { productId } = req.params;
  try {
    const results = await getSimilarProducts(productId);
    res.json(results);
  } catch (err) {
    // Si es un error personalizado, responde con su status y mensaje
    if (err.status && err.message) {
      res.status(err.status).json({ message: err.message });
    } else {
      // Para otros errores, responde 500
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
});

module.exports = router;
