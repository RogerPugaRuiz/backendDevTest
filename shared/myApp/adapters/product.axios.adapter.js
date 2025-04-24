const axios = require('axios');
const ProductPort = require('../ports/product.port');

class ProductAxiosAdapter extends ProductPort {
  constructor(baseURL = 'http://localhost:3001') {
    super();
    this.api = axios.create({ baseURL });
  }
  async getSimilarIds(productId) {
    const resp = await this.api.get(`/product/${productId}/similarids`);
    return resp.data;
  }
  async getProductDetail(productId) {
    const resp = await this.api.get(`/product/${productId}`);
    return resp.data;
  }
}

module.exports = ProductAxiosAdapter;
