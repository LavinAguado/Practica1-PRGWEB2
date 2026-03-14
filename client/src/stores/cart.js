import { writable } from 'svelte/store';

// Initialize from localStorage if available
const storedCart = localStorage.getItem('cart');
let initialCart = [];
try {
  if (storedCart) {
    const parsed = JSON.parse(storedCart);
    if (Array.isArray(parsed)) {
      initialCart = parsed;
    }
  }
} catch (e) {
  console.warn("Error parsing cart:", e);
}

export const cart = writable(initialCart);

// Subscription to automatically save to localStorage
cart.subscribe(value => {
  localStorage.setItem('cart', JSON.stringify(value));
});

export function addToCart(product, quantity) {
  cart.update(items => {
    const existing = items.find(i => i.productId === product._id);
    if (existing) {
      existing.quantity += quantity;
      return [...items];
    } else {
      return [...items, {
        productId: product._id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity
      }];
    }
  });
}

export function removeFromCart(productId) {
  cart.update(items => items.filter(i => i.productId !== productId));
}

export function clearCart() {
  cart.set([]);
}

export function updateQuantity(productId, newQuantity) {
  cart.update(items => {
    const existing = items.find(i => i.productId === productId);
    if (existing) {
      existing.quantity = newQuantity;
    }
    return [...items];
  });
}
