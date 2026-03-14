<script>
  import { onMount } from 'svelte';
  import { api } from '../services/api.js';
  import { user } from '../stores/auth.js';
  import { addToCart } from '../stores/cart.js';

  let products = $state([]);
  let loading = $state(true);
  let errorMsg = $state('');

  // Estados de Modales
  let showCreateModal = $state(false);
  let showDetailModal = $state(false);
  let selectedProduct = $state(null);
  let editingProductId = $state(null);

  // Formulario de creación
  let formProduct = $state({
    title: '',
    description: '',
    price: 0,
    stock: 0,
    image: ''
  });
  
  // Estado local para cantidades seleccionadas de cada producto
  let selectedQuantities = $state({});

  async function loadProducts() {
    loading = true;
    errorMsg = '';
    try {
      products = await api.getProducts();
      // Inicializar cantidades de selección
      let qs = {};
      products.forEach(p => qs[p._id] = 1);
      selectedQuantities = qs;
    } catch (err) {
      errorMsg = 'Error al cargar los productos: ' + err.message;
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    loadProducts();
  });

  // Acciones
  function openDetails(p) {
    selectedProduct = p;
    showDetailModal = true;
  }

  function closeDetails() {
    showDetailModal = false;
    selectedProduct = null;
  }

  function openCreate() {
    editingProductId = null;
    formProduct = { title: '', description: '', price: 0, stock: 0, image: '' };
    showCreateModal = true;
  }

  function openEdit(p) {
    editingProductId = p._id;
    formProduct = { title: p.title, description: p.description, price: p.price, stock: p.stock, image: p.image || '' };
    showCreateModal = true;
  }

  function closeCreate() {
    showCreateModal = false;
    editingProductId = null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editingProductId) {
        const updated = await api.updateProduct(editingProductId, formProduct);
        products = products.map(p => p._id === editingProductId ? updated : p);
        if (selectedProduct?._id === editingProductId) selectedProduct = updated;
      } else {
        const created = await api.createProduct(formProduct);
        products = [created, ...products];
        selectedQuantities[created._id] = 1;
      }
      closeCreate();
    } catch (err) {
      alert('Error guardando: ' + err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm('¿Seguro que deseas eliminar este producto?')) return;
    try {
      await api.deleteProduct(id);
      products = products.filter(p => p._id !== id);
    } catch (err) {
      alert('Error borrando: ' + err.message);
    }
  }

  function incQty(id, max) {
    if (selectedQuantities[id] < max) selectedQuantities[id]++;
  }

  function decQty(id) {
    if (selectedQuantities[id] > 1) selectedQuantities[id]--;
  }

  function handleAddToCart(p) {
    const qty = selectedQuantities[p._id];
    addToCart(p, qty);
    // feedback visual opcional aquí
  }
</script>

<div class="products-container">
  <div class="header">
    <h1>Productos</h1>
    {#if $user?.role === 'admin'}
      <button class="btn btn-primary" onclick={openCreate}>
        + Nuevo Producto
      </button>
    {/if}
  </div>

  {#if loading}
    <div class="loading">Cargando productos...</div>
  {:else if errorMsg}
    <div class="alert error">{errorMsg}</div>
  {:else if products.length === 0}
    <div class="empty-state">No hay productos disponibles por el momento.</div>
  {:else}
    <div class="grid">
      {#each products as p (p._id)}
        <div class="card">
          <div class="card-image">
            {#if p.image}
              <img src={p.image} alt={p.title} />
            {:else}
              <div class="img-placeholder">🛒</div>
            {/if}
          </div>
          <div class="card-content">
            <h3>{p.title}</h3>
            <p class="price">${p.price}</p>
            <span class="status {p.stock > 0 ? 'active' : 'inactive'}">
              {p.stock > 0 ? `Stock: ${p.stock}` : 'Sin stock'}
            </span>
            
            <div class="cart-controls" style="margin-top: 1rem;">
              <div class="qty-select">
                <button onclick={() => decQty(p._id)} disabled={p.stock === 0 || selectedQuantities[p._id] <= 1}>-</button>
                <span>{selectedQuantities[p._id] || 1}</span>
                <button onclick={() => incQty(p._id, p.stock)} disabled={p.stock === 0 || selectedQuantities[p._id] >= p.stock}>+</button>
              </div>
              <button 
                class="btn btn-primary btn-sm" 
                disabled={p.stock === 0} 
                onclick={() => handleAddToCart(p)}
                style="flex: 1"
              >
                Añadir
              </button>
            </div>
            
          </div>
          <div class="card-actions">
            <button class="btn btn-secondary" onclick={() => openDetails(p)}>Detalles</button>
            {#if $user?.role === 'admin'}
              <button class="btn btn-secondary" onclick={() => openEdit(p)}>Editar</button>
              <button class="btn btn-danger" onclick={() => handleDelete(p._id)}>Borrar</button>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<!-- Modal Detalles -->
{#if showDetailModal && selectedProduct}
  <div class="modal-backdrop" onclick={closeDetails}>
    <div class="modal-content" onclick={(e) => e.stopPropagation()}>
      <h2>Detalle del Producto</h2>
      {#if selectedProduct.image}
        <img src={selectedProduct.image} alt={selectedProduct.title} class="modal-image" />
      {/if}
      <h3>{selectedProduct.title}</h3>
      <p class="modal-price">${selectedProduct.price}</p>
      <p class="modal-desc">{selectedProduct.description || 'Sin descripción'}</p>
      <p class="modal-stock">Stock: {selectedProduct.stock}</p>
      <div class="modal-actions">
        <button class="btn btn-secondary" onclick={closeDetails}>Cerrar</button>
      </div>
    </div>
  </div>
{/if}

<!-- Modal Creación / Edición -->
{#if showCreateModal}
  <div class="modal-backdrop" onclick={closeCreate}>
    <div class="modal-content" onclick={(e) => e.stopPropagation()}>
      <h2>{editingProductId ? 'Editar Producto' : 'Crear Nuevo Producto'}</h2>
      <form onsubmit={handleSubmit}>
        <div class="form-group">
          <label>Título</label>
          <input type="text" bind:value={formProduct.title} required />
        </div>
        <div class="form-group">
          <label>Descripción</label>
          <textarea bind:value={formProduct.description} rows="3" required></textarea>
        </div>
        <div class="form-group">
          <label>Precio</label>
          <input type="number" step="0.01" bind:value={formProduct.price} required />
        </div>
        <div class="form-group">
          <label>Stock</label>
          <input type="number" bind:value={formProduct.stock} required />
        </div>
        <div class="form-group">
          <label>URL Imagen (opcional)</label>
          <input type="url" bind:value={formProduct.image} />
        </div>

        <div class="modal-actions">
          <button type="button" class="btn btn-secondary" onclick={closeCreate}>Cancelar</button>
          <button type="submit" class="btn btn-primary">Guardar</button>
        </div>
      </form>
    </div>
  </div>
{/if}

<style>
  .products-container {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  .header h1 {
    margin: 0;
    color: var(--primary-color);
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  .card {
    background: var(--surface-color);
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.05);
    transition: transform 0.2s, box-shadow 0.2s;
    display: flex;
    flex-direction: column;
  }

  .card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
    border-color: rgba(255, 255, 255, 0.1);
  }

  .card-image {
    height: 160px;
    background: rgba(0,0,0,0.2);
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }

  .card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .img-placeholder {
    font-size: 3rem;
    opacity: 0.5;
  }

  .card-content {
    padding: 1.5rem;
    flex-grow: 1;
  }

  .card-content h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.2rem;
  }

  .price {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--primary-color);
    margin: 0 0 1rem 0;
  }

  .status {
    display: inline-block;
    padding: 0.2rem 0.6rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 600;
  }

  .status.active {
    background: rgba(46, 213, 115, 0.1);
    color: #2ed573;
  }

  .status.inactive {
    background: rgba(255, 71, 87, 0.1);
    color: #ff4757;
  }

  .card-actions {
    padding: 1rem 1.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    display: flex;
    gap: 0.5rem;
  }

  .card-actions button {
    flex: 1;
  }

  .loading, .empty-state {
    text-align: center;
    padding: 3rem;
    color: var(--text-muted);
    font-size: 1.2rem;
  }

  .alert.error {
    background: rgba(255, 71, 87, 0.1);
    color: #ff4757;
    padding: 1rem;
    border-radius: 8px;
    text-align: center;
  }

  .modal-image {
    width: 100%;
    height: 200px;
    object-fit: contain;
    background: rgba(0,0,0,0.2);
    border-radius: 8px;
    margin-bottom: 1rem;
  }

  .modal-price {
    font-size: 2rem;
    font-weight: 700;
    color: var(--primary-color);
    margin: 0 0 1rem 0;
  }

  .modal-desc {
    color: var(--text-muted);
    margin-bottom: 1rem;
    line-height: 1.6;
  }

  .modal-stock {
    font-weight: 600;
  }
  
  .cart-controls {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .qty-select {
    display: flex;
    align-items: center;
    background: rgba(0,0,0,0.2);
    border-radius: 6px;
    padding: 0.1rem;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .qty-select button {
    background: none;
    border: none;
    color: var(--text-color);
    width: 28px;
    height: 28px;
    cursor: pointer;
  }
  .qty-select button:disabled { opacity: 0.3; cursor: not-allowed; }
  .qty-select button:hover:not(:disabled) { background: rgba(255,255,255,0.1); border-radius: 4px; }
  .qty-select span { font-size: 0.9rem; min-width: 24px; text-align: center; }
  
  .btn-sm {
    padding: 0.4rem 0.8rem;
    font-size: 0.85rem;
  }
</style>
