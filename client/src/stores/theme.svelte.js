// theme.svelte.js
// Modern Svelte 5 state using $state()

const initialTheme = localStorage.getItem('theme') || 'dark';

export const themeState = $state({
  current: initialTheme
});

export function toggleTheme() {
  themeState.current = themeState.current === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', themeState.current);
  updateDocumentTheme();
}

export function updateDocumentTheme() {
  if (themeState.current === 'dark') {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
  } else {
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('dark');
  }
}
