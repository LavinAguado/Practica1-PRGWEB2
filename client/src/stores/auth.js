import { writable } from 'svelte/store';

// Restore from localStorage if exists
const initialToken = localStorage.getItem('token') || '';
const initialUser = JSON.parse(localStorage.getItem('user') || 'null');

export const token = writable(initialToken);
export const user = writable(initialUser);

export function login(newToken, newUser) {
  token.set(newToken);
  user.set(newUser);
  localStorage.setItem('token', newToken);
  localStorage.setItem('user', JSON.stringify(newUser));
}

export function logout() {
  token.set('');
  user.set(null);
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}
