import { get } from 'svelte/store';
import { token, logout } from '../stores/auth.js';

const API_URL = 'http://localhost:4000/api';

async function authFetch(endpoint, options = {}, isAbsolute = false) {
  const currentToken = get(token);
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (currentToken) {
    headers['Authorization'] = `Bearer ${currentToken}`;
  }

  const url = isAbsolute ? endpoint : `${API_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers
  });

  if (response.status === 401 || response.status === 403) {
    import('../stores/toast.js').then(m => m.showToast('Sesión expirada o no autorizada', 'error'));
    logout();
    throw new Error('Sesión expirada o no autorizada');
  }

  let data;
  try {
    data = await response.json();
  } catch(e) {
    throw new Error('Error en la respuesta del servidor');
  }

  if (!response.ok) {
    throw new Error(data.message || 'Error en la petición');
  }

  // Si es GraphQL, los errores de validación vienen en data.errors
  if (data.errors && data.errors.length > 0) {
    throw new Error(data.errors[0].message);
  }

  return data;
}

export const api = {
  login: (email, password) => authFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }),
  register: (username, email, password) => authFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, email, password })
  }),
  getProducts: () => authFetch('/products'),
  createProduct: (data) => authFetch('/products', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateProduct: (id, data) => authFetch(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  deleteProduct: (id) => authFetch(`/products/${id}`, {
    method: 'DELETE'
  }),
  createOrder: (items) => authFetch('http://localhost:4000/graphql', {
    method: 'POST',
    body: JSON.stringify({
      query: `
        mutation {
          createOrder(
            items: ${JSON.stringify(items).replace(/"([^"]+)":/g, '$1:')}
          ) {
            id
            total
            status
            createdAt
          }
        }
      `
    })
  }, true),
  getMyOrders: () => authFetch('http://localhost:4000/graphql', {
    method: 'POST',
    body: JSON.stringify({
      query: `
        query {
          myOrders {
            id
            total
            status
            createdAt
            products {
              product { title price image }
              quantity
            }
          }
        }
      `
    })
  }, true),
  // User Management
  getUsers: () => authFetch('/users'),
  updateUserRole: (id, role) => authFetch(`/users/${id}/role`, {
    method: 'PUT',
    body: JSON.stringify({ role })
  }),
  deleteUser: (id) => authFetch(`/users/${id}`, {
    method: 'DELETE'
  })
};
