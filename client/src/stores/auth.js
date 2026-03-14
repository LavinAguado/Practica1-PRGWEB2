import { writable } from 'svelte/store';

export const token = writable('');
export const user = writable(null);

export function login(newToken, newUser) {
  token.set(newToken);
  user.set(newUser);
}

export function logout() {
  token.set('');
  user.set(null);
}
