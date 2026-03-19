// cart.svelte.js
// Modern Svelte 5 state using $state()

const initialCart = JSON.parse(localStorage.getItem('cart') || '[]');

export const cartState = $state({
  items: initialCart
});

// Sync to localStorage
$effect.root(() => {
  $effect(() => {
    localStorage.setItem('cart', JSON.stringify(cartState.items));
  });
});

export function addToCart(product, quantity = 1) {
  const existing = cartState.items.find(item => item._id === product._id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cartState.items = [...cartState.items, { ...product, quantity }];
  }
}

export function removeFromCart(productId) {
  cartState.items = cartState.items.filter(item => item._id !== productId);
}

export function updateQuantity(productId, quantity) {
  const item = cartState.items.find(item => item._id === productId);
  if (item) {
    item.quantity = quantity;
    if (item.quantity <= 0) {
      removeFromCart(productId);
    }
  }
}

export function clearCart() {
  cartState.items = [];
}
