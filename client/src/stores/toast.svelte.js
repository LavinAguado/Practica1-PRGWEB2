// toast.svelte.js
// Modern Svelte 5 state using $state()

export const toastState = $state({
  toasts: []
});

export function showToast(message, type = 'info', duration = 3000) {
  const id = Date.now();
  toastState.toasts = [...toastState.toasts, { id, message, type }];
  
  setTimeout(() => {
    toastState.toasts = toastState.toasts.filter(t => t.id !== id);
  }, duration);
}
