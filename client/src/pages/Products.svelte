<script>
  import { onMount } from "svelte";
  import { api } from "../services/api.js";
  import { user } from "../stores/auth.js";
  import { addToCart } from "../stores/cart.js";
  import ProductCard from "../components/ProductCard.svelte";
  import ProductForm from "../components/ProductForm.svelte";

  // --- $state() for main application state ---
  let products = $state([]);
  let loading = $state(true);
  let errorMsg = $state("");
  let searchTerm = $state("");

  // Modal state
  let showForm = $state(false);
  let showDetailModal = $state(false);
  let selectedProduct = $state(null);
  let editingProductId = $state(null);
  let formProduct = $state({
    title: "",
    description: "",
    price: 0,
    stock: 0,
    image: "",
  });

  // Quantity selectors per product
  let selectedQuantities = $state({});

  // --- $derived() for computed/derived values ---
  let filteredProducts = $derived(
    searchTerm.trim() === ""
      ? products
      : products.filter(
          (p) =>
            p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.description?.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
  );

  let productCount = $derived(products.length);
  let filteredCount = $derived(filteredProducts.length);
  let isAdmin = $derived($user?.role === "admin");

  // --- $effect() for side-effects ---
  // Re-load products whenever the user role changes (e.g login/logout swap)
  $effect(() => {
    const role = $user?.role; // track the role
    if ($user) {
      loadProducts();
    }
  });

  async function loadProducts() {
    loading = true;
    errorMsg = "";
    try {
      products = await api.getProducts();
      let qs = {};
      products.forEach((p) => (qs[p._id] = 1));
      selectedQuantities = qs;
    } catch (err) {
      errorMsg = "Error al cargar los productos: " + err.message;
    } finally {
      loading = false;
    }
  }

  // -- Actions (passed as callbacks to children) --
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
    formProduct = { title: "", description: "", price: 0, stock: 0, image: "" };
    showForm = true;
  }

  function openEdit(p) {
    editingProductId = p._id;
    formProduct = {
      title: p.title,
      description: p.description,
      price: p.price,
      stock: p.stock,
      image: p.image || "",
    };
    showForm = true;
  }

  function closeForm() {
    showForm = false;
    editingProductId = null;
  }

  async function handleSave(data) {
    try {
      if (editingProductId) {
        const updated = await api.updateProduct(editingProductId, data);
        products = products.map((p) =>
          p._id === editingProductId ? updated : p,
        );
        if (selectedProduct?._id === editingProductId)
          selectedProduct = updated;
      } else {
        const created = await api.createProduct(data);
        products = [created, ...products];
        selectedQuantities[created._id] = 1;
      }
      closeForm();
    } catch (err) {
      alert("Error guardando: " + err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm("¿Seguro que deseas eliminar este producto?")) return;
    try {
      await api.deleteProduct(id);
      products = products.filter((p) => p._id !== id);
      // También lo eliminamos de las cantidades seleccionadas
      delete selectedQuantities[id];
      selectedQuantities = { ...selectedQuantities };
    } catch (err) {
      console.error("Error borrando producto:", err);
      alert("Error borrando: " + err.message);
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
  }
</script>

<div class="products-container">
  <div class="header">
    <div>
      <h1>Productos</h1>
      <p class="product-count">{filteredCount} de {productCount} productos</p>
    </div>
    <div class="header-actions">
      <input
        type="text"
        class="search-input"
        placeholder="🔎 Buscar productos..."
        bind:value={searchTerm}
      />
      {#if isAdmin}
        <button class="btn btn-primary" onclick={openCreate}>
          + Nuevo Producto
        </button>
      {/if}
    </div>
  </div>

  {#if loading}
    <div class="loading">Cargando productos...</div>
  {:else if errorMsg}
    <div class="alert error">{errorMsg}</div>
  {:else if filteredProducts.length === 0}
    <div class="empty-state">
      {#if searchTerm}
        No se encontraron productos para "{searchTerm}".
      {:else}
        No hay productos disponibles por el momento.
      {/if}
    </div>
  {:else}
    <div class="grid">
      {#each filteredProducts as p (p._id)}
        <ProductCard
          product={p}
          quantity={selectedQuantities[p._id] || 1}
          {isAdmin}
          onDetails={openDetails}
          onEdit={openEdit}
          onDelete={handleDelete}
          onIncQty={incQty}
          onDecQty={decQty}
          onAddToCart={handleAddToCart}
        />
      {/each}
    </div>
  {/if}
</div>

<!-- Modal Detalles -->
{#if showDetailModal && selectedProduct}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div class="modal-backdrop" onclick={closeDetails}>
    <div class="modal-content" onclick={(e) => e.stopPropagation()}>
      <h2>Detalle del Producto</h2>
      {#if selectedProduct.image}
        <img
          src={selectedProduct.image}
          alt={selectedProduct.title}
          class="modal-image"
        />
      {/if}
      <h3>{selectedProduct.title}</h3>
      <p class="modal-price">${selectedProduct.price}</p>
      <p class="modal-desc">
        {selectedProduct.description || "Sin descripción"}
      </p>
      <p class="modal-stock">Stock: {selectedProduct.stock}</p>
      <div class="modal-actions">
        <button class="btn btn-secondary" onclick={closeDetails}>Cerrar</button>
      </div>
    </div>
  </div>
{/if}

<!-- Modal Creación / Edición via ProductForm component -->
{#if showForm}
  <ProductForm
    product={formProduct}
    isEditing={!!editingProductId}
    onSave={handleSave}
    onCancel={closeForm}
  />
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
    align-items: flex-start;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .header h1 {
    margin: 0;
    color: var(--primary-color);
  }

  .product-count {
    margin: 0.3rem 0 0 0;
    font-size: 0.9rem;
    color: var(--text-muted);
  }

  .header-actions {
    display: flex;
    gap: 0.75rem;
    align-items: center;
  }

  .search-input {
    padding: 0.6rem 1rem;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.2);
    color: var(--text-color);
    font-size: 0.95rem;
    width: 240px;
    transition: border-color 0.2s;
  }
  .search-input:focus {
    outline: none;
    border-color: var(--primary-color);
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  .loading,
  .empty-state {
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

  /* Detail modal styles */
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 200;
    backdrop-filter: blur(4px);
  }

  .modal-content {
    background: var(--surface-color);
    padding: 2rem;
    border-radius: 16px;
    width: 90%;
    max-width: 500px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    max-height: 90vh;
    overflow-y: auto;
  }

  .modal-content h2 {
    margin-top: 0;
    color: var(--primary-color);
  }

  .modal-image {
    width: 100%;
    height: 200px;
    object-fit: contain;
    background: rgba(0, 0, 0, 0.2);
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

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 1rem;
  }
</style>
