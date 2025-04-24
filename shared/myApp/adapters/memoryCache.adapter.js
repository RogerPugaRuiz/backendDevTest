const ProductPort = require('../ports/product.port');

class MemoryCacheAdapter extends ProductPort {
  constructor(adapter) {
    super();
    this.adapter = adapter;
    this.products = {};
    this.similarIds = {};
    this.loaded = false;
    this.loadAll(); // Cargar todo al construir
  }

  async loadAll() {
    if (this.loaded) return;
    const ids = [1,2,3,4,5,6,100,1000,10000];
    for (const id of ids) {
      try {
        const similar = await this.adapter.getSimilarIds(id);
        this.similarIds[id] = similar;
      } catch {}
      try {
        const product = await this.adapter.getProductDetail(id);
        this.products[id] = product;
      } catch {}
    }
    this.loaded = true;
  }

  async getSimilarIds(productId) {
    return this.similarIds[productId];
  }

  async getProductDetail(productId) {
    return this.products[productId];
  }
}

module.exports = MemoryCacheAdapter;
