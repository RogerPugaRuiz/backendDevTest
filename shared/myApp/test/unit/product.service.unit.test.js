const { getSimilarProducts } = require('../../service/product.service');
const { NotFoundError } = require('../../error/error');

// Mock port para aislar dependencias externas
function createMockPort({ similarIds = [], productDetails = {} }) {
  return {
    getSimilarIds: jest.fn().mockResolvedValue(similarIds),
    getProductDetail: jest.fn(id => Promise.resolve(productDetails[id] || null)),
  };
}

describe('getSimilarProducts', () => {
  it('devuelve productos similares válidos', async () => {
    const mockProducts = {
      '2': { id: '2', name: 'A', price: 10, availability: true },
      '3': { id: '3', name: 'B', price: 20, availability: false }
    };
    const port = createMockPort({ similarIds: ['2', '3'], productDetails: mockProducts });
    const result = await getSimilarProducts('1', port);
    expect(result).toEqual([mockProducts['2'], mockProducts['3']]);
    expect(port.getSimilarIds).toHaveBeenCalledWith('1');
    expect(port.getProductDetail).toHaveBeenCalledWith('2');
    expect(port.getProductDetail).toHaveBeenCalledWith('3');
  });

  it('lanza NotFoundError si no hay similares', async () => {
    const port = createMockPort({ similarIds: [] });
    await expect(getSimilarProducts('1', port)).rejects.toThrow(NotFoundError);
  });

  it('lanza NotFoundError si todos los detalles son nulos', async () => {
    const port = createMockPort({ similarIds: ['2', '3'], productDetails: { '2': null, '3': null } });
    await expect(getSimilarProducts('1', port)).rejects.toThrow(NotFoundError);
  });

  it('devuelve solo productos válidos si algunos detalles son nulos', async () => {
    const mockProducts = {
      '2': { id: '2', name: 'A', price: 10, availability: true },
      '3': null
    };
    const port = createMockPort({ similarIds: ['2', '3'], productDetails: mockProducts });
    const result = await getSimilarProducts('1', port);
    expect(result).toEqual([mockProducts['2']]);
  });
});
