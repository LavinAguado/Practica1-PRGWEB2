<script>
  import { api } from '../services/api.js';
  import { login } from '../stores/auth.svelte.js';
  import { navigate } from '../stores/router.svelte.js';
  import { showToast } from '../stores/toast.svelte.js';

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

<style>
  .login-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: calc(100vh - 120px);
    padding: 2rem;
    background: radial-gradient(circle at top right, rgba(var(--primary-color-rgb), 0.1), transparent 40%),
                radial-gradient(circle at bottom left, rgba(var(--primary-color-rgb), 0.05), transparent 40%);
  }

  .login-card {
    background: rgba(22, 27, 34, 0.7);
    backdrop-filter: blur(12px) saturate(180%);
    -webkit-backdrop-filter: blur(12px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 24px;
    padding: 3rem;
    width: 100%;
    max-width: 450px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
    text-align: center;
    transition: transform 0.3s ease;
  }

  :root.light .login-card {
    background: rgba(255, 255, 255, 0.8);
    border-color: rgba(0, 0, 0, 0.05);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }

  .login-header h1 {
    font-size: 2.2rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
    background: linear-gradient(135deg, var(--primary-color), #8892b0);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .login-header p {
    color: var(--text-muted);
    margin-bottom: 2.5rem;
  }

  .input-group {
    margin-bottom: 1.5rem;
    text-align: left;
  }

  .input-label {
    display: block;
    font-size: 0.85rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: var(--text-color);
    opacity: 0.8;
  }

  .input-field {
    width: 100%;
    padding: 1rem 1.2rem;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.2);
    color: var(--text-color);
    font-size: 1rem;
    transition: all 0.3s ease;
  }

  :root.light .input-field {
    background: rgba(0, 0, 0, 0.03);
    border-color: rgba(0, 0, 0, 0.1);
  }

  .input-field:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 4px rgba(var(--primary-color-rgb), 0.15);
    background: rgba(0, 0, 0, 0.3);
  }

  .error-box {
    background: rgba(248, 81, 73, 0.1);
    color: var(--danger-color);
    padding: 0.8rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    font-size: 0.9rem;
    border: 1px solid rgba(248, 81, 73, 0.2);
  }

  .submit-btn {
    width: 100%;
    padding: 1rem;
    border-radius: 12px;
    border: none;
    background: var(--primary-color);
    color: white;
    font-weight: 700;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 1rem;
    box-shadow: 0 4px 15px rgba(var(--primary-color-rgb), 0.3);
  }

  .submit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(var(--primary-color-rgb), 0.4);
    filter: brightness(1.1);
  }

  .submit-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  .toggle-mode {
    margin-top: 2rem;
    font-size: 0.9rem;
    color: var(--text-muted);
  }

  .toggle-btn {
    background: none;
    border: none;
    color: var(--primary-color);
    font-weight: 700;
    cursor: pointer;
    padding: 0 0.5rem;
    text-decoration: underline;
  }

  .toggle-btn:hover {
    filter: brightness(1.2);
  }
</style>

<div class="login-wrapper">
  <div class="login-card">
    <div class="login-header">
      <h1>{isLogin ? '¡Bienvenido!' : 'Crea tu Cuenta'}</h1>
      <p>{isLogin ? 'Accede a tu portal de productos' : 'Únete a nuestra comunidad hoy'}</p>
    </div>

    {#if errorMsg}
      <div class="error-box">
        {errorMsg}
      </div>
    {/if}

    <form onsubmit={handleSubmit}>
      {#if !isLogin}
        <div class="input-group">
          <label class="input-label" for="username">Nombre de Usuario</label>
          <input 
            type="text" 
            id="username"
            class="input-field"
            bind:value={username} 
            placeholder="JohnDoe"
            required 
          />
        </div>
      {/if}

      <div class="input-group">
        <label class="input-label" for="email">E-mail</label>
        <input 
          type="email" 
          id="email"
          class="input-field"
          bind:value={email} 
          placeholder="ejemplo@correo.com"
          required 
        />
      </div>

      <div class="input-group">
        <label class="input-label" for="password">Contraseña</label>
        <input 
          type="password" 
          id="password"
          class="input-field"
          bind:value={password} 
          placeholder="••••••••"
          required 
        />
      </div>

      {#if !isLogin}
        <div class="input-group">
          <label class="input-label" for="confirmPassword">Confirmar Contraseña</label>
          <input 
            type="password" 
            id="confirmPassword"
            class="input-field"
            bind:value={confirmPassword} 
            placeholder="••••••••"
            required 
          />
        </div>
      {/if}

      <button type="submit" class="submit-btn" disabled={loading}>
        {loading ? 'Procesando...' : (isLogin ? 'Entrar' : 'Registrarse')}
      </button>
    </form>

    <div class="toggle-mode">
      {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
      <button class="toggle-btn" onclick={toggleMode}>
        {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
      </button>
    </div>
  </div>
</div>
