import client from '../api/client';

export const fetchProducts = () => {
  return client.get('/api/products');
};