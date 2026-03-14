<script>
  import { cart, removeFromCart, updateQuantity, clearCart } from '../stores/cart.js';
  import { api } from '../services/api.js';
  import { navigate } from '../stores/router.js';
  import { user } from '../stores/auth.js';

  let totalValue = $derived($cart.reduce((sum, item) => sum + (item.price * item.quantity), 0));
  let isCheckingOut = $state(false);

  async function handleCheckout() {
    if (!$user) {
      alert('Debes iniciar sesión para realizar un pedido.');
      navigate('login');
      return;
    }

    isCheckingOut = true;
    try {
      const items = $cart.map(i => ({
        productId: i.productId,
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

  {#if $cart.length === 0}
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
        {#each $cart as item (item.productId)}
          <div class="cart-item">
            <div class="item-info">
              {#if item.image}
                <img src={item.image} alt={item.title} />
              {:else}
                <div class="img-placeholder">📦</div>
              {/if}
              <div>
                <h3>{item.title}</h3>
                <p class="price">${item.price.toFixed(2)}</p>
              </div>
            </div>
            
            <div class="item-actions">
              <div class="qty-control">
                <button 
                  onclick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                  disabled={item.quantity <= 1}
                >-</button>
                <span>{item.quantity}</span>
                <button 
                  onclick={() => updateQuantity(item.productId, item.quantity + 1)}
                >+</button>
              </div>
              
              <p class="item-total">${(item.price * item.quantity).toFixed(2)}</p>
              
              <button 
                class="btn-icon danger" 
                onclick={() => removeFromCart(item.productId)}
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
          <span>Artículos ({$cart.reduce((s, i) => s + i.quantity, 0)}):</span>
          <span>${totalValue.toFixed(2)}</span>
        </div>
        <hr />
        <div class="summary-row total">
          <span>Total:</span>
          <span>${totalValue.toFixed(2)}</span>
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
    padding: 2rem;
    max-width: 1000px;
    margin: 0 auto;
  }

  h1 {
    color: var(--primary-color);
    margin-bottom: 2rem;
  }

  .empty-cart {
    text-align: center;
    padding: 4rem 2rem;
    background: var(--surface-color);
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.05);
  }

  .empty-cart .emoji {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  .cart-content {
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 2rem;
  }

  @media (max-width: 768px) {
    .cart-content {
      grid-template-columns: 1fr;
    }
  }

  .cart-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--surface-color);
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    border: 1px solid rgba(255,255,255,0.05);
  }

  .item-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .item-info img, .img-placeholder {
    width: 60px;
    height: 60px;
    border-radius: 8px;
    object-fit: cover;
  }
  
  .img-placeholder {
    background: rgba(0,0,0,0.2);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.5rem;
  }

  .item-info h3 {
    margin: 0 0 0.2rem 0;
    font-size: 1rem;
  }

  .item-info .price {
    margin: 0;
    color: var(--text-muted);
    font-size: 0.9rem;
  }

  .item-actions {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .qty-control {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(0,0,0,0.2);
    padding: 0.2rem;
    border-radius: 6px;
  }

  .qty-control button {
    background: rgba(255,255,255,0.1);
    border: none;
    color: white;
    width: 28px;
    height: 28px;
    border-radius: 4px;
    cursor: pointer;
  }

  .qty-control button:hover:not(:disabled) {
    background: rgba(255,255,255,0.2);
  }

  .qty-control button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .qty-control span {
    min-width: 20px;
    text-align: center;
    font-size: 0.95rem;
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
