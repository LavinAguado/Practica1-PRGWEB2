<script>
  // Svelte 5: $props() for component props + callbacks for child→parent comm
  let {
    product,
    quantity = 1,
    isAdmin = false,
    onDetails,
    onEdit,
    onDelete,
    onIncQty,
    onDecQty,
    onAddToCart
  } = $props();
</script>

<div class="card">
  <div class="card-image">
    {#if product.image}
      <img src={product.image} alt={product.title} onerror={() => product.image = ''} />
    {:else}
      <div class="img-placeholder">🛒</div>
    {/if}
  </div>
  <div class="card-content">
    <h3>{product.title}</h3>
    <p class="price">{product.price} €</p>
    <span class="status {product.stock > 0 ? 'active' : 'inactive'}">
      {product.stock > 0 ? `Stock: ${product.stock}` : 'Sin stock'}
    </span>

    <div class="cart-controls" style="margin-top: 1rem;">
      <div class="qty-select">
        <button onclick={() => onDecQty(product._id)} disabled={product.stock === 0 || quantity <= 1}>-</button>
        <span>{quantity}</span>
        <button onclick={() => onIncQty(product._id, product.stock)} disabled={product.stock === 0 || quantity >= product.stock}>+</button>
      </div>
      <button
        class="btn btn-primary btn-sm"
        disabled={product.stock === 0}
        onclick={() => onAddToCart(product)}
        style="flex: 1"
      >
        Añadir
      </button>
    </div>
  </div>
  <div class="card-actions">
    <button class="btn btn-secondary" onclick={() => onDetails(product)}>Detalles</button>
    {#if isAdmin}
      <button class="btn btn-secondary" onclick={() => onEdit(product)}>Editar</button>
      <button class="btn btn-danger" onclick={() => onDelete(product._id)}>Borrar</button>
    {/if}
  </div>
</div>

<style>
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
  .status.active { background: rgba(46, 213, 115, 0.1); color: #2ed573; }
  .status.inactive { background: rgba(255, 71, 87, 0.1); color: #ff4757; }

  .card-actions {
    padding: 1rem 1.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    display: flex;
    gap: 0.5rem;
  }
  .card-actions button { flex: 1; }

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
