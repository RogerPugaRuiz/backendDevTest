const express = require('express');
const router = express.Router();
const axios = require('axios');

// GET /product/:productId/similar
router.get('/:productId/similar', async function(req, res) {
  const { productId } = req.params;
  try {
    // Obtener los IDs similares del mock
    const idsResp = await axios.get(`http://localhost:3001/product/${productId}/similarids`);
    const similarIds = idsResp.data;
    // Obtener detalles de cada producto similar
    const detailPromises = similarIds.map(id =>
      axios.get(`http://localhost:3001/product/${id}`)
        .then(r => r.data)
        .catch(e => null)
    );
    let details = await Promise.all(detailPromises);
    details = details.filter(d => d && d.id); // Solo productos válidos
    if (details.length === 0) {
      return res.status(404).json({ message: 'Product Not found' });
    }
    res.json(details);
  } catch (err) {
    res.status(404).json({ message: 'Product Not found' });
  }
});

module.exports = router;
