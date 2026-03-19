<script>
  import { onMount } from 'svelte';
  import { auth } from '../stores/auth.svelte.js';
  import { api } from '../services/api.js';

  let orders = $state([]);
  let loadingOrders = $state(true);

  onMount(async () => {
    if (auth.user) {
      try {
        const res = await api.getMyOrders();
        orders = res.data.myOrders || [];
      } catch (err) {
        console.error('Error cargando pedidos:', err);
      } finally {
        loadingOrders = false;
      }
    }
  });
</script>

<div class="profile-container">
  <div class="profile-card">
    <div class="avatar">👤</div>
    <h2>Mi Perfil</h2>
    
    {#if auth.user}
      <div class="info-group">
        <span class="label">ID de Usuario</span>
        <p>{auth.user.id}</p>
      </div>
      <div class="info-group">
        <span class="label">Nombre de Usuario</span>
        <p>{auth.user.username}</p>
      </div>
      <div class="info-group">
        <span class="label">Rol</span>
        <span class="badge {auth.user.role === 'admin' ? 'admin' : 'user'}">
          {auth.user.role.toUpperCase()}
        </span>
      </div>
    {:else}
      <p>Cargando información del usuario...</p>
    {/if}
  </div>

  {#if auth.user}
    <div class="orders-section">
      <h2>Mis Pedidos</h2>
      {#if loadingOrders}
        <p class="text-muted">Cargando historial de pedidos...</p>
      {:else if orders.length === 0}
        <p class="text-muted">No tienes pedidos anteriores.</p>
      {:else}
        <div class="orders-list">
          {#each orders as order}
            <div class="order-card">
              <div class="order-header">
                <span class="order-id">Pedido #{order.id.slice(-6).toUpperCase()}</span>
                <span class="order-status status-{order.status.toLowerCase()}">{order.status}</span>
              </div>
              <div class="order-date">
                {new Date(parseInt(order.createdAt)).toLocaleDateString()}
              </div>
              <div class="order-products">
                {#each order.products as item}
                  <div class="order-item">
                    <div class="item-main">
                      {#if item.product.image}
                        <img src={item.product.image} alt={item.product.title} class="order-img" />
                      {:else}
                        <div class="order-img-placeholder">📦</div>
                      {/if}
                      <span>{item.quantity}x {item.product.title}</span>
                    </div>
                    <span>{(item.product.price * item.quantity).toFixed(2)} €</span>
                  </div>
                {/each}
              </div>
              <div class="order-total">
                <strong>Total:</strong> {order.total.toFixed(2)} €
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .profile-container {
    max-width: 600px;
    margin: 2rem auto;
    padding: 0 1rem;
  }

  .profile-card {
    background: var(--surface-color);
    padding: 2rem;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.05);
    text-align: center;
  }

  .avatar {
    font-size: 4rem;
    margin-bottom: 1rem;
    background: rgba(255, 255, 255, 0.05);
    width: 100px;
    height: 100px;
    line-height: 100px;
    border-radius: 50%;
    margin: 0 auto 1.5rem auto;
  }

  h2 {
    color: var(--text-color);
    margin-bottom: 2rem;
  }

  .info-group {
    background: rgba(0, 0, 0, 0.2);
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    text-align: left;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  .info-group .label {
    display: block;
    font-size: 0.85rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 0.5rem;
  }

  .info-group p {
    margin: 0;
    font-size: 1.1rem;
    color: var(--text-color);
    font-weight: 500;
  }

  .badge {
    display: inline-block;
    padding: 0.3rem 0.8rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 700;
  }
  .badge.admin {
    background: rgba(255, 71, 87, 0.1);
    color: #ff4757;
    border: 1px solid rgba(255, 71, 87, 0.3);
  }
  .badge.user {
    background: rgba(46, 213, 115, 0.1);
    color: #2ed573;
    border: 1px solid rgba(46, 213, 115, 0.3);
  }

  /* Orders Section */
  .orders-section {
    margin-top: 3rem;
  }

  .text-muted {
    color: var(--text-muted);
    text-align: center;
  }

  .orders-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .order-card {
    background: var(--surface-color);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 1.5rem;
  }

  .order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .order-id {
    font-weight: 700;
    color: var(--text-color);
  }

  .order-status {
    font-size: 0.8rem;
    padding: 0.3rem 0.6rem;
    border-radius: 12px;
    font-weight: 600;
  }
  .status-pending { background: rgba(255, 171, 0, 0.1); color: #ffab00; }
  .status-completed { background: rgba(46, 213, 115, 0.1); color: #2ed573; }
  .status-cancelled { background: rgba(255, 71, 87, 0.1); color: #ff4757; }

  .order-date {
    font-size: 0.85rem;
    color: var(--text-muted);
    margin-bottom: 1rem;
  }

  .order-products {
    background: rgba(0, 0, 0, 0.2);
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
  }

  .order-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.9rem;
    margin-bottom: 0.82rem;
    color: var(--text-muted);
  }
  .order-item:last-child {
    margin-bottom: 0;
  }

  .item-main {
    display: flex;
    align-items: center;
    gap: 0.8rem;
  }

  .order-img {
    width: 32px;
    height: 32px;
    object-fit: cover;
    border-radius: 4px;
    background: rgba(0,0,0,0.2);
  }

  .order-img-placeholder {
    width: 32px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(255,255,255,0.05);
    border-radius: 4px;
    font-size: 1rem;
  }

  .order-total {
    text-align: right;
    font-size: 1.1rem;
    color: var(--primary-color);
  }
</style>
