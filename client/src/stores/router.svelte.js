// router.svelte.js
// Modern Svelte 5 state using $state()

const initialPath = window.location.pathname.replace('/', '') || 'login';

export const router = $state({
  current: initialPath
});

export function navigate(route) {
  router.current = route;
  window.history.pushState({}, '', '/' + route);
}

window.addEventListener('popstate', () => {
  const path = window.location.pathname.replace('/', '') || 'login';
  router.current = path;
});
