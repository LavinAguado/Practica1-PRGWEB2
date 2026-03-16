<script>
  import { onMount } from 'svelte';
  import { api } from '../services/api.js';
  import { user as userStore } from '../stores/auth.js';
  import { showToast } from '../stores/toast.js';

  let users = $state([]);
  let loading = $state(true);
  let errorMsg = $state('');
  let successMsg = $state('');

  onMount(loadUsers);

  async function loadUsers() {
    loading = true;
    errorMsg = '';
    try {
      users = await api.getUsers();
    } catch (err) {
      errorMsg = err.message;
    } finally {
      loading = false;
    }
  }

  async function toggleRole(u) {
    const newRole = u.role === 'admin' ? 'user' : 'admin';
    if (!confirm(`¿Cambiar el rol de ${u.username} a ${newRole}?`)) return;
    
    try {
      await api.updateUserRole(u._id, newRole);
      showToast(`Rol de ${u.username} actualizado a ${newRole}`, 'success');
      loadUsers();
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  async function handleDelete(u) {
    if (!confirm(`¿Estás seguro de eliminar a ${u.username}? Esta acción no se puede deshacer.`)) return;
    
    try {
      await api.deleteUser(u._id);
      showToast(`Usuario ${u.username} eliminado`, 'success');
      loadUsers();
    } catch (err) {
      showToast(err.message, 'error');
    }
  }
</script>

<div class="admin-container">
  <header class="admin-header">
    <h1>Gestión de Usuarios</h1>
    <p>Administra los roles y el acceso a la plataforma.</p>
  </header>

  {#if errorMsg}
    <div class="alert alert-danger">{errorMsg}</div>
  {/if}

  {#if successMsg}
    <div class="alert alert-success">{successMsg}</div>
  {/if}

  {#if loading}
    <div class="loading-state">
      <div class="spinner"></div>
      <p>Cargando usuarios...</p>
    </div>
  {:else}
    <div class="users-table-container">
      <table class="users-table">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Fecha Registro</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {#each users as u}
            <tr>
              <td>
                <div class="user-info">
                  <span class="avatar">{u.username[0].toUpperCase()}</span>
                  <span class="username">{u.username} {u._id === $userStore?.id ? '(Tú)' : ''}</span>
                </div>
              </td>
              <td>{u.email}</td>
              <td>
                <span class="role-badge {u.role}">
                  {u.role.toUpperCase()}
                </span>
              </td>
              <td>{new Date(u.createdAt).toLocaleDateString()}</td>
              <td>
                <div class="actions">
                  <button 
                    class="btn btn-secondary btn-sm" 
                    onclick={() => toggleRole(u)}
                    disabled={u._id === $userStore?.id}
                    title="Cambiar Rol"
                  >
                    🔄 Rol
                  </button>
                  <button 
                    class="btn btn-danger btn-sm" 
                    onclick={() => handleDelete(u)}
                    disabled={u._id === $userStore?.id}
                    title="Eliminar Usuario"
                  >
                    🗑️ Borrar
                  </button>
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>

<style>
  .admin-container {
    max-width: 1200px;
    margin: 2rem auto;
    padding: 0 1rem;
    animation: fadeIn 0.5s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .admin-header {
    margin-bottom: 2rem;
  }

  .admin-header h1 {
    font-size: 2.5rem;
    background: linear-gradient(45deg, var(--primary-color), #a29bfe);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 0.5rem;
  }

  .admin-header p {
    color: var(--text-color);
    opacity: 0.7;
  }

  .users-table-container {
    background: var(--surface-color);
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }

  .users-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
  }

  .users-table th {
    background: rgba(0, 0, 0, 0.2);
    padding: 1.2rem;
    font-weight: 600;
    color: var(--primary-color);
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .users-table td {
    padding: 1.2rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    vertical-align: middle;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .avatar {
    width: 36px;
    height: 36px;
    background: var(--primary-color);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1rem;
  }

  .role-badge {
    padding: 0.3rem 0.8rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 700;
  }

  .role-badge.admin {
    background: rgba(162, 155, 254, 0.1);
    color: #a29bfe;
    border: 1px solid rgba(162, 155, 254, 0.3);
  }

  .role-badge.user {
    background: rgba(0, 184, 148, 0.1);
    color: #00b894;
    border: 1px solid rgba(0, 184, 148, 0.3);
  }

  .actions {
    display: flex;
    gap: 0.5rem;
  }

  .btn-sm {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }

  /* Spinner */
  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(255, 255, 255, 0.1);
    border-top: 4px solid var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .alert {
    padding: 1rem;
    border-radius: 12px;
    margin-bottom: 1.5rem;
  }

  .alert-danger {
    background: rgba(255, 71, 87, 0.1);
    color: #ff4757;
    border: 1px solid rgba(255, 71, 87, 0.3);
  }

  .alert-success {
    background: rgba(46, 213, 115, 0.1);
    color: #2ed573;
    border: 1px solid rgba(46, 213, 115, 0.3);
  }

  @media (max-width: 768px) {
    .users-table th:nth-child(2),
    .users-table td:nth-child(2),
    .users-table th:nth-child(4),
    .users-table td:nth-child(4) {
      display: none;
    }
  }
</style>
