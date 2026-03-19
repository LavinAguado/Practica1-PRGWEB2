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

  let imageSrc = $state(product.image);
  $effect(() => {
    imageSrc = product.image;
  });
</script>

<div class="card">
  <div class="card-image">
    {#if imageSrc}
      <img src={imageSrc} alt={product.title} onerror={() => imageSrc = ''} />
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
    border-radius: 20px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.05);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    display: flex;
    flex-direction: column;
    position: relative;
  }

  .card:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 30px rgba(0, 0, 0, 0.4);
    border-color: rgba(var(--primary-color-rgb), 0.3);
  }

  .card-image {
    height: 180px;
    background: rgba(0,0,0,0.1);
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    position: relative;
  }

  .card-image::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.4));
  }

  .card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s ease;
  }

  .card:hover .card-image img {
    transform: scale(1.1);
  }

  .img-placeholder {
    font-size: 3.5rem;
    opacity: 0.3;
  }

  .card-content {
    padding: 1.5rem;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }

  .card-content h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.25rem;
    font-weight: 700;
  }

  .price {
    font-size: 1.6rem;
    font-weight: 800;
    color: var(--primary-color);
    margin: 0 0 1rem 0;
    letter-spacing: -0.5px;
  }

  .status {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    width: fit-content;
  }
  .status.active { background: rgba(46, 213, 115, 0.1); color: #2ed573; }
  .status.inactive { background: rgba(255, 71, 87, 0.1); color: #ff4757; }

  .card-actions {
    padding: 1.25rem 1.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    display: flex;
    gap: 0.75rem;
    background: rgba(255,255,255,0.02);
  }
  .card-actions button { 
    flex: 1; 
    border-radius: 10px;
    font-weight: 600;
  }

  .cart-controls {
    display: flex;
    gap: 0.75rem;
    align-items: center;
    margin-top: auto;
    padding-top: 1rem;
  }

  .qty-select {
    display: flex;
    align-items: center;
    background: rgba(0,0,0,0.2);
    border-radius: 10px;
    padding: 2px;
    border: 1px solid rgba(255,255,255,0.08);
  }

  :root.light .qty-select {
    background: rgba(0,0,0,0.05);
  }

  .qty-select button {
    background: none;
    border: none;
    color: var(--text-color);
    width: 32px;
    height: 32px;
    cursor: pointer;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }
  .qty-select button:disabled { opacity: 0.3; cursor: not-allowed; }
  .qty-select button:hover:not(:disabled) { background: rgba(255,255,255,0.1); border-radius: 8px; }
  .qty-select span { font-size: 1rem; min-width: 30px; text-align: center; font-weight: 600; }

  .btn-sm {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
    border-radius: 10px;
  }
</style>
