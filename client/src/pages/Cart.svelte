<script>
  import { cartState, removeFromCart, updateQuantity, clearCart } from '../stores/cart.svelte.js';
  import { api } from '../services/api.js';
  import { navigate, router } from '../stores/router.svelte.js';
  import { auth } from '../stores/auth.svelte.js';

  let totalValue = $derived(cartState.items.reduce((sum, item) => sum + (item.price * item.quantity), 0));
  let isCheckingOut = $state(false);

  async function handleCheckout() {
    if (!auth.user) {
      alert('Debes iniciar sesión para realizar un pedido.');
      navigate('login');
      return;
    }

    isCheckingOut = true;
    try {
      const items = cartState.items.map(i => ({
        productId: i._id, // Notice I changed i.productId to i._id based on ProductCard/Products logic
        quantity: i.quantity
      }));
      await api.createOrder(items);
      alert('✅ Pedido realizado correctamente');
      clearCart();
      navigate('profile');
    } catch (err) {
      alert('Error en el checkout: ' + err.message);
    } finally {
      isCheckingOut = false;
    }
  }
</script>

<div class="cart-container">
  <h1>Tu Carrito</h1>

  {#if cartState.items.length === 0}
    <div class="empty-cart">
      <div class="emoji">🛒</div>
      <p>Tu carrito está vacío.</p>
      <button class="btn btn-primary" onclick={() => navigate('products')}>
        Explorar Productos
      </button>
    </div>
  {:else}
    <div class="cart-content">
      <div class="cart-items">
        {#each cartState.items as item (item._id)}
          <div class="cart-item">
            <div class="item-info">
              {#if item.image}
                <img src={item.image} alt={item.title} />
              {:else}
                <div class="img-placeholder">📦</div>
              {/if}
              <div>
                <h3>{item.title}</h3>
                <p class="price">{item.price.toFixed(2)} €</p>
              </div>
            </div>
            
            <div class="item-actions">
              <div class="qty-control">
                <button 
                  onclick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                  disabled={item.quantity <= 1}
                >-</button>
                <span>{item.quantity}</span>
                <button 
                  onclick={() => updateQuantity(item._id, item.quantity + 1)}
                >+</button>
              </div>
              
              <p class="item-total">{(item.price * item.quantity).toFixed(2)} €</p>
              
              <button 
                class="btn-icon danger" 
                onclick={() => removeFromCart(item._id)}
                title="Eliminar"
              >
                🗑️
              </button>
            </div>
          </div>
        {/each}
      </div>
      
      <div class="cart-summary">
        <h2>Resumen del Pedido</h2>
        <div class="summary-row">
          <span>Artículos ({cartState.items.reduce((s, i) => s + i.quantity, 0)}):</span>
          <span>{totalValue.toFixed(2)} €</span>
        </div>
        <hr />
        <div class="summary-row total">
          <span>Total:</span>
          <span>{totalValue.toFixed(2)} €</span>
        </div>
        
        <button 
          class="btn btn-primary checkout-btn" 
          onclick={handleCheckout} 
          disabled={isCheckingOut}
        >
          {isCheckingOut ? 'Procesando...' : 'Finalizar Compra'}
        </button>
      </div>
    </div>
  {/if}
</div>

<style>
  .cart-container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 3rem 1.5rem;
  }

  h1 {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 2.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .empty-cart {
    text-align: center;
    padding: 6rem 2rem;
    background: var(--surface-color);
    border-radius: 24px;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  .empty-cart .emoji {
    font-size: 5rem;
    margin-bottom: 1.5rem;
    display: block;
  }

  .cart-content {
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 2.5rem;
    align-items: start;
  }

  @media (max-width: 850px) {
    .cart-content {
      grid-template-columns: 1fr;
    }
  }

  .cart-items {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
  }

  .cart-item {
    background: var(--surface-color);
    border-radius: 20px;
    padding: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid rgba(255, 255, 255, 0.05);
    transition: transform 0.2s;
  }

  .cart-item:hover {
    border-color: rgba(var(--primary-color-rgb), 0.2);
  }

  .item-info {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .item-info img, .img-placeholder {
    width: 80px;
    height: 80px;
    border-radius: 12px;
    object-fit: cover;
    background: rgba(0,0,0,0.1);
  }

  .item-info h3 {
    font-size: 1.15rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
  }

  .item-info .price {
    font-weight: 600;
    color: var(--text-muted);
  }

  .item-actions {
    display: flex;
    align-items: center;
    gap: 2rem;
  }

  .qty-control {
    display: flex;
    align-items: center;
    background: rgba(0,0,0,0.1);
    border-radius: 10px;
    padding: 2px;
  }

  .qty-control button {
    background: none;
    border: none;
    color: var(--text-color);
    width: 32px;
    height: 32px;
    cursor: pointer;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    transition: all 0.2s;
  }

  .qty-control button:hover:not(:disabled) {
    background: rgba(255,255,255,0.05);
  }

  .qty-control span {
    min-width: 35px;
    text-align: center;
    font-weight: 700;
  }

  .item-total {
    font-weight: 600;
    min-width: 70px;
    text-align: right; margin: 0;
  }

  .btn-icon {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.2s;
  }

  .btn-icon:hover {
    opacity: 1;
  }

  .cart-summary {
    background: var(--surface-color);
    padding: 1.5rem;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.05);
    height: fit-content;
  }

  .cart-summary h2 {
    font-size: 1.2rem;
    margin-bottom: 1.5rem;
  }

  .summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
    color: var(--text-muted);
  }

  .summary-row.total {
    color: var(--text-color);
    font-size: 1.2rem;
    font-weight: 700;
  }

  hr {
    border: 0;
    border-top: 1px solid rgba(255,255,255,0.1);
    margin: 1rem 0;
  }

  .checkout-btn {
    width: 100%;
    margin-top: 1.5rem;
    padding: 1rem;
    font-size: 1.05rem;
  }
</style>
