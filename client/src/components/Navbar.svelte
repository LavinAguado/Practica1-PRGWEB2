<script>
  import { router, navigate } from '../stores/router.svelte.js';
  import { auth, logout } from '../stores/auth.svelte.js';
  import { cartState } from '../stores/cart.svelte.js';
  import { themeState, toggleTheme } from '../stores/theme.svelte.js';

  // $derived() – computed values from reactive state
  let totalItems = $derived(cartState.items.reduce((sum, item) => sum + item.quantity, 0));
  let userDisplayName = $derived(auth.user?.username ?? 'Usuario');
  let isAdmin = $derived(auth.user?.role === 'admin');
  let themeEmoji = $derived(themeState.current === 'dark' ? '🌙' : '☀️');

  function handleLogout() {
    logout();
    navigate('login');
  }
</script>

<nav class="navbar">
  <div class="nav-brand">
    <h2>🛍️ Portal Productos</h2>
  </div>
  <div class="nav-theme">
    <button class="theme-btn" onclick={toggleTheme} title="Cambiar tema">
      {themeEmoji}
    </button>
  </div>
  <div class="nav-links">
    {#if auth.user}
      <span class="user-greeting">Hola, <strong>{userDisplayName}</strong>{#if isAdmin} <span class="role-tag">ADMIN</span>{/if}</span>
      <button 
        class="nav-link {router.current === 'products' ? 'active' : ''}" 
        onclick={() => navigate('products')}
      >
        Productos
      </button>
      <button 
        class="nav-link {router.current === 'chat' ? 'active' : ''}" 
        onclick={() => navigate('chat')}
      >
        💬 Chat / Soporte
      </button>
      {#if isAdmin}
        <button 
          class="nav-link {router.current === 'admin' ? 'active' : ''}" 
          onclick={() => navigate('admin')}
        >
          🛡️ Admin
        </button>
      {/if}
      <button 
        class="nav-link {router.current === 'profile' ? 'active' : ''}" 
        onclick={() => navigate('profile')}
      >
        Mi Perfil
      </button>
      <button 
        class="nav-link {router.current === 'cart' ? 'active' : ''}" 
        onclick={() => navigate('cart')}
      >
        🛒 Carrito {#if totalItems > 0}<span class="cart-badge">{totalItems}</span>{/if}
      </button>
      <button class="nav-link logout-btn" onclick={handleLogout}>Cerrar Sesión</button>
    {:else}
      <button 
        class="nav-link {router.current === 'login' ? 'active' : ''}" 
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
    padding: 0.75rem 2rem;
    background: rgba(var(--surface-color-rgb, 22, 27, 34), 0.8);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    position: sticky;
    top: 0;
    z-index: 100;
  }

  :root.light .navbar {
    background: rgba(255, 255, 255, 0.8);
    border-bottom-color: rgba(0, 0, 0, 0.05);
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
  .nav-theme {
    margin: 0 1rem;
    display: flex;
    align-items: center;
  }

  .theme-btn {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 1.2rem;
    transition: all 0.2s ease;
  }

  :root.light .theme-btn {
    background: rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.1);
  }

  .theme-btn:hover {
    transform: scale(1.1);
    background: rgba(255, 255, 255, 0.2);
  }

  :root.light .theme-btn:hover {
    background: rgba(0, 0, 0, 0.1);
  }
</style>
