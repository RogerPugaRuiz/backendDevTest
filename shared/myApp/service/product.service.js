const axios = require('axios');

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001',
  timeout: 1000, // 1 segundo de timeout
});

async function getSimilarProducts(productId) {
  // Obtener los IDs similares del mock
  const idsResp = await axiosInstance.get(`/product/${productId}/similarids`);
  const similarIds = idsResp.data;
  if (!Array.isArray(similarIds) || similarIds.length === 0) {
    return [];
  }
  // Limitar concurrencia (por ejemplo, 5 a la vez)
  const limit = 5;
  const results = [];
  for (let i = 0; i < similarIds.length; i += limit) {
    const chunk = similarIds.slice(i, i + limit);
    const settled = await Promise.allSettled(
      chunk.map(id =>
        axiosInstance.get(`/product/${id}`)
          .then(r => r.data)
      )
    );
    results.push(...settled
      .filter(r => r.status === 'fulfilled' && r.value && r.value.id)
      .map(r => r.value)
    );
  }
  return results;
}

module.exports = { getSimilarProducts };
