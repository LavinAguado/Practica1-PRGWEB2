import { writable } from 'svelte/store';

// Default to login, but if the URL has a path, use it.
const initialPath = window.location.pathname.replace('/', '') || 'login';
export const currentRoute = writable(initialPath);

export function navigate(route) {
  currentRoute.set(route);
  window.history.pushState({}, '', '/' + route);
}

window.addEventListener('popstate', () => {
  const path = window.location.pathname.replace('/', '') || 'login';
  currentRoute.set(path);
});
