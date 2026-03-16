<script>
  import { api } from '../services/api.js';
  import { login } from '../stores/auth.js';
  import { navigate } from '../stores/router.js';
  import { showToast } from '../stores/toast.js';

  let isLogin = $state(true);
  let username = $state('');
  let email = $state('');
  let password = $state('');
  let confirmPassword = $state('');
  let errorMsg = $state('');
  let loading = $state(false);

  async function handleSubmit(e) {
    e.preventDefault();
    errorMsg = '';
    
    if (!isLogin && password !== confirmPassword) {
      errorMsg = 'Las contraseñas no coinciden';
      return;
    }

    loading = true;
    try {
      if (isLogin) {
        const data = await api.login(email, password);
        login(data.token, data.user);
        showToast(`Bienvenido de nuevo, ${data.user.username}`, 'success');
        navigate('products');
      } else {
        const data = await api.register(username, email, password);
        login(data.token, data.user);
        showToast('Cuenta creada con éxito. ¡Bienvenido!', 'success');
        navigate('products');
      }
    } catch (err) {
      errorMsg = err.message || (isLogin ? 'Error en el login' : 'Error en el registro');
    } finally {
      loading = false;
    }
  }

  function toggleMode() {
    isLogin = !isLogin;
    errorMsg = '';
  }
</script>

<div class="login-container">
  <div class="login-card">
    <div class="logo">{isLogin ? '🔐' : '📝'}</div>
    <h1>{isLogin ? 'Bienvenido' : 'Crear Cuenta'}</h1>
    <p class="subtitle">
      {isLogin ? 'Ingresa a tu cuenta para continuar' : 'Regístrate para empezar a comprar'}
    </p>

    {#if errorMsg}
      <div class="alert error">{errorMsg}</div>
    {/if}

    <form onsubmit={handleSubmit}>
      {#if !isLogin}
        <div class="form-group">
          <label for="username">Nombre de usuario</label>
          <input 
            id="username" 
            type="text" 
            bind:value={username} 
            required 
            placeholder="Usuario123"
          />
        </div>
      {/if}

      <div class="form-group">
        <label for="email">Email</label>
        <input 
          id="email" 
          type="email" 
          bind:value={email} 
          required 
          placeholder="email@ejemplo.com"
        />
      </div>
      
      <div class="form-group">
        <label for="password">Contraseña</label>
        <input 
          id="password" 
          type="password" 
          bind:value={password} 
          required 
          placeholder="••••••••"
        />
      </div>

      {#if !isLogin}
        <div class="form-group">
          <label for="confirmPassword">Confirmar Contraseña</label>
          <input 
            id="confirmPassword" 
            type="password" 
            bind:value={confirmPassword} 
            required 
            placeholder="••••••••"
          />
        </div>
      {/if}

      <button type="submit" disabled={loading} class="btn-primary">
        {#if loading}
          <span class="spinner"></span> {isLogin ? 'Iniciando...' : 'Creando cuenta...'}
        {:else}
          {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
        {/if}
      </button>
    </form>

    <div class="toggle-mode">
      <span>{isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}</span>
      <button class="link-btn" onclick={toggleMode}>
        {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
      </button>
    </div>
  </div>
</div>

<style>
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: calc(100vh - 80px);
    padding: 1rem;
  }

  .login-card {
    background: var(--surface-color);
    padding: 2.5rem 2rem;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    width: 100%;
    max-width: 400px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    text-align: center;
  }

  .logo {
    font-size: 3rem;
    margin-bottom: 0.5rem;
  }

  h1 {
    margin: 0;
    font-size: 1.8rem;
    color: var(--text-color);
  }

  .subtitle {
    color: var(--text-muted);
    margin-bottom: 2rem;
    font-size: 0.95rem;
  }

  .form-group {
    text-align: left;
    margin-bottom: 1.5rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    font-size: 0.9rem;
    color: var(--text-color);
  }

  input {
    width: 100%;
    padding: 0.8rem 1rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.2);
    color: var(--text-color);
    font-size: 1rem;
    transition: border-color 0.2s;
  }

  input:focus {
    outline: none;
    border-color: var(--primary-color);
  }

  .btn-primary {
    width: 100%;
    padding: 0.8rem;
    border: none;
    border-radius: 8px;
    background: var(--primary-color);
    color: #fff;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.1s, background 0.2s;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
  }

  .btn-primary:hover:not(:disabled) {
    background: var(--primary-hover);
    transform: translateY(-2px);
  }

  .btn-primary:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .alert.error {
    background: rgba(255, 71, 87, 0.1);
    color: #ff4757;
    padding: 0.8rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    border: 1px solid rgba(255, 71, 87, 0.2);
    font-size: 0.9rem;
  }

  .spinner {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255,255,255,0.3);
    border-radius: 50%;
    border-top-color: #fff;
    animation: spin 1s ease-in-out infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .toggle-mode {
    margin-top: 1.5rem;
    font-size: 0.9rem;
    color: var(--text-muted);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .link-btn {
    background: none;
    border: none;
    color: var(--primary-color);
    font-weight: 600;
    cursor: pointer;
    font-size: 0.9rem;
    padding: 0;
    transition: filter 0.2s;
  }

  .link-btn:hover {
    filter: brightness(1.2);
    text-decoration: underline;
  }
</style>
