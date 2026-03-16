<script>
  import { onMount } from 'svelte';
  import { currentRoute, navigate } from './stores/router.js';
  import { token } from './stores/auth.js';

  import Navbar from './components/Navbar.svelte';
  import Login from './pages/Login.svelte';
  import Products from './pages/Products.svelte';
  import Profile from './pages/Profile.svelte';
  import Cart from './pages/Cart.svelte';
  import Chat from './pages/Chat.svelte';
  import AdminPanel from './pages/AdminPanel.svelte';
  import { user as userStore } from './stores/auth.js';
  import ToastContainer from './components/ToastContainer.svelte';

  // Proteger rutas si no hay token (simulado simple de SPA auth guard)
  $effect(() => {
    if (!$token && $currentRoute !== 'login') {
      navigate('login');
    }
    // Proteger admin: solo si es admin
    if ($currentRoute === 'admin' && $userStore?.role !== 'admin') {
      navigate('products');
    }
  });
</script>

<main>
  {#if $token}
    <Navbar />
  {/if}

  <div class="content">
    {#if $currentRoute === 'login'}
      <Login />
    {:else if $currentRoute === 'products'}
      <Products />
    {:else if $currentRoute === 'profile'}
      <Profile />
    {:else if $currentRoute === 'cart'}
      <Cart />
    {:else if $currentRoute === 'chat'}
      <Chat />
    {:else if $currentRoute === 'admin'}
      <AdminPanel />
    {:else}
      <!-- Catch all or 404 -->
      <Login />
    {/if}
  </div>
  <ToastContainer />
</main>

<style>
  .content {
    min-height: calc(100vh - 80px); /* 80px is approx navbar height */
  }
</style>
