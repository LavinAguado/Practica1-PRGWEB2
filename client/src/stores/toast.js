import { writable } from 'svelte/store';

export const toasts = writable([]);

export function showToast(message, type = 'info', duration = 3000) {
  const id = Math.random().toString(36).substr(2, 9);
  toasts.update(all => [{ id, message, type }, ...all]);
  
  if (duration) {
    setTimeout(() => {
      dismissToast(id);
    }, duration);
  }
}

export function dismissToast(id) {
  toasts.update(all => all.filter(t => t.id !== id));
}
