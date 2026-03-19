<script>
  import { onMount } from 'svelte';
  import { router, navigate } from './stores/router.svelte.js';
  import { auth } from './stores/auth.svelte.js';
  import { updateDocumentTheme } from './stores/theme.svelte.js';

  import Navbar from './components/Navbar.svelte';
  import Login from './pages/Login.svelte';
  import Products from './pages/Products.svelte';
  import Profile from './pages/Profile.svelte';
  import Cart from './pages/Cart.svelte';
  import Chat from './pages/Chat.svelte';
  import AdminPanel from './pages/AdminPanel.svelte';
  import ToastContainer from './components/ToastContainer.svelte';
  import { fade } from 'svelte/transition';

  onMount(() => {
    updateDocumentTheme();
  });

  // Proteger rutas si no hay token (simulado simple de SPA auth guard)
  $effect(() => {
    if (!auth.token && router.current !== 'login') {
      navigate('login');
    }
    // Proteger admin: solo si es admin
    if (router.current === 'admin' && auth.user?.role !== 'admin') {
      navigate('products');
    }
  });
</script>

<main>
  <Navbar />

  <div class="content">
    {#key router.current}
      <div in:fade={{ duration: 300, delay: 100 }}>
        {#if router.current === 'login'}
          <Login />
        {:else if router.current === 'products'}
          <Products />
        {:else if router.current === 'profile'}
          <Profile />
        {:else if router.current === 'cart'}
          <Cart />
        {:else if router.current === 'chat'}
          <Chat />
        {:else if router.current === 'admin'}
          <AdminPanel />
        {:else}
          <!-- Catch all or 404 -->
          <Login />
        {/if}
      </div>
    {/key}
  </div>
  <ToastContainer />
</main>

<style>
  .content {
    min-height: calc(100vh - 80px); /* 80px is approx navbar height */
  }
</style>
