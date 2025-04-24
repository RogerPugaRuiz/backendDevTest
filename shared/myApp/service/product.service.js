const axios = require('axios');
const ProductAxiosAdapter = require('../adapters/product.axios.adapter');
const MemoryCacheAdapter = require('../adapters/memoryCache.adapter');
const { NotFoundError } = require('../error/error');

// Usar el decorador de caché sobre el adaptador axios
const adapter = new MemoryCacheAdapter(new ProductAxiosAdapter());
// const adapter = new ProductAxiosAdapter();

async function getSimilarProducts(productId, port = adapter) {
  const similarIds = await port.getSimilarIds(productId);
  if (!Array.isArray(similarIds) || similarIds.length === 0) {
    throw new NotFoundError();
  }
  // Ejecutar todas las peticiones en paralelo y esperar a que terminen
  const products = await Promise.all(
    similarIds.map(id => port.getProductDetail(String(id)))
  );
  // Filtrar productos nulos o sin id
  const results = products.filter(product => product && product.id);
  if (results.length === 0) {
    throw new NotFoundError();
  }
  return results;
}

module.exports = { getSimilarProducts };
