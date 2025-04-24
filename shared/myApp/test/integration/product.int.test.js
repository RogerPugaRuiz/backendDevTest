const request = require('supertest');
const app = require('../../app');

beforeAll(async () => {
  await new Promise(resolve => setTimeout(resolve, 3000));
});

describe('GET /product/:productId/similar', () => {
  it('debe devolver un array de productos similares válidos (200)', async () => {
    const res = await request(app).get('/product/1/similar');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      res.body.forEach(product => {
        expect(product).toHaveProperty('id');
        expect(product).toHaveProperty('name');
        expect(product).toHaveProperty('price');
        expect(product).toHaveProperty('availability');
      });
    }
  });

  it('debe devolver 404 si el producto no existe o no hay similares', async () => {
    const res = await request(app).get('/product/999999/similar');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'Product Not found');
  });
});
