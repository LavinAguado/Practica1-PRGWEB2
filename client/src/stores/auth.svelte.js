// auth.svelte.js
// Modern Svelte 5 state using $state()

const initialToken = localStorage.getItem('token') || '';
const initialUser = JSON.parse(localStorage.getItem('user') || 'null');

export const auth = $state({
  token: initialToken,
  user: initialUser
});

export function login(newToken, newUser) {
  auth.token = newToken;
  auth.user = newUser;
  localStorage.setItem('token', newToken);
  localStorage.setItem('user', JSON.stringify(newUser));
}

export function logout() {
  auth.token = '';
  auth.user = null;
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}
