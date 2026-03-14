<script>
  import { currentRoute, navigate } from '../stores/router.js';
  import { user, logout } from '../stores/auth.js';
  import { cart } from '../stores/cart.js';

  // $derived() – computed values from reactive state
  let totalItems = $derived($cart.reduce((sum, item) => sum + item.quantity, 0));
  let userDisplayName = $derived($user?.username ?? 'Usuario');
  let isAdmin = $derived($user?.role === 'admin');

  function handleLogout() {
    logout();
    navigate('login');
  }
</script>

<nav class="navbar">
  <div class="nav-brand">
    <h2>🛍️ Portal Productos</h2>
  </div>
  <div class="nav-links">
    {#if $user}
      <span class="user-greeting">Hola, <strong>{userDisplayName}</strong>{#if isAdmin} <span class="role-tag">ADMIN</span>{/if}</span>
      <button 
        class="nav-link {$currentRoute === 'products' ? 'active' : ''}" 
        onclick={() => navigate('products')}
      >
        Productos
      </button>
      <button 
        class="nav-link {$currentRoute === 'chat' ? 'active' : ''}" 
        onclick={() => navigate('chat')}
      >
        💬 Chat / Soporte
      </button>
      <button 
        class="nav-link {$currentRoute === 'profile' ? 'active' : ''}" 
        onclick={() => navigate('profile')}
      >
        Mi Perfil
      </button>
      <button 
        class="nav-link {$currentRoute === 'cart' ? 'active' : ''}" 
        onclick={() => navigate('cart')}
      >
        🛒 Carrito {#if totalItems > 0}<span class="cart-badge">{totalItems}</span>{/if}
      </button>
      <button class="nav-link logout-btn" onclick={handleLogout}>Cerrar Sesión</button>
    {:else}
      <button 
        class="nav-link {$currentRoute === 'login' ? 'active' : ''}" 
        onclick={() => navigate('login')}
      >
        Login
      </button>
    {/if}
  </div>
</nav>

<style>
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    position: sticky;
    top: 0;
    z-index: 100;
  }
  
  .nav-brand h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-color);
  }

  .nav-links {
    display: flex;
    gap: 1rem;
  }

  .nav-link {
    background: none;
    border: none;
    color: var(--text-muted);
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    transition: all 0.2s ease;
  }

  .nav-link:hover {
    color: var(--text-color);
    background: rgba(255, 255, 255, 0.1);
  }

  .nav-link.active {
    color: var(--primary-color);
    background: rgba(var(--primary-color-rgb), 0.1);
  }

  .cart-badge {
    background: var(--primary-color);
    color: white;
    font-size: 0.75rem;
    padding: 2px 6px;
    border-radius: 12px;
    margin-left: 5px;
  }

  .logout-btn {
    color: #ff4757;
  }
  .logout-btn:hover {
    background: rgba(255, 71, 87, 0.1);
    color: #ff4757;
  }

  .user-greeting {
    color: var(--text-muted);
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0 0.5rem;
  }
  .user-greeting strong {
    color: var(--text-color);
  }

  .role-tag {
    background: rgba(255, 71, 87, 0.15);
    color: #ff4757;
    font-size: 0.65rem;
    padding: 2px 6px;
    border-radius: 4px;
    font-weight: 700;
    letter-spacing: 0.5px;
  }

  @media (max-width: 600px) {
    .navbar {
      flex-direction: column;
      gap: 1rem;
      padding: 1rem;
    }
  }
</style>
