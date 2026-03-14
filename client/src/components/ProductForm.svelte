<script>
  // Svelte 5: $props() for component props + callback for save/cancel
  let {
    product = { title: '', description: '', price: 0, stock: 0, image: '' },
    isEditing = false,
    onSave,
    onCancel
  } = $props();

  // Local form state – initialized via $effect to avoid "state_referenced_locally"
  let title = $state('');
  let description = $state('');
  let price = $state(0);
  let stock = $state(0);
  let image = $state('');

  // $effect() – syncs form state whenever the `product` prop changes
  $effect(() => {
    title = product.title;
    description = product.description;
    price = product.price;
    stock = product.stock;
    image = product.image || '';
  });

  function handleSubmit(e) {
    e.preventDefault();
    onSave({ title, description, price: Number(price), stock: Number(stock), image });
  }

  function handleKeydown(e) {
    if (e.key === 'Escape') onCancel();
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class="modal-backdrop" onclick={onCancel} onkeydown={handleKeydown}>
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="modal-content" onclick={(e) => e.stopPropagation()} onkeydown={() => {}}>

    <h2>{isEditing ? 'Editar Producto' : 'Crear Nuevo Producto'}</h2>
    <form onsubmit={handleSubmit}>
      <div class="form-group">
        <label for="pf-title">Título</label>
        <input id="pf-title" type="text" bind:value={title} required />
      </div>
      <div class="form-group">
        <label for="pf-desc">Descripción</label>
        <textarea id="pf-desc" bind:value={description} rows="3" required></textarea>
      </div>
      <div class="form-group">
        <label for="pf-price">Precio</label>
        <input id="pf-price" type="number" step="0.01" bind:value={price} required />
      </div>
      <div class="form-group">
        <label for="pf-stock">Stock</label>
        <input id="pf-stock" type="number" bind:value={stock} required />
      </div>
      <div class="form-group">
        <label for="pf-image">URL Imagen (opcional)</label>
        <input id="pf-image" type="url" bind:value={image} />
      </div>

      <div class="modal-actions">
        <button type="button" class="btn btn-secondary" onclick={onCancel}>Cancelar</button>
        <button type="submit" class="btn btn-primary">Guardar</button>
      </div>
    </form>
  </div>
</div>

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.6);
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
    border: 1px solid rgba(255,255,255,0.1);
    max-height: 90vh;
    overflow-y: auto;
  }

  .modal-content h2 {
    margin-top: 0;
    color: var(--primary-color);
    margin-bottom: 1.5rem;
  }

  .form-group {
    margin-bottom: 1.2rem;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.4rem;
    font-weight: 500;
    font-size: 0.9rem;
    color: var(--text-color);
  }

  .form-group input,
  .form-group textarea {
    width: 100%;
    padding: 0.7rem 1rem;
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 8px;
    background: rgba(0,0,0,0.2);
    color: var(--text-color);
    font-size: 1rem;
    transition: border-color 0.2s;
  }

  .form-group input:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: var(--primary-color);
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 1.5rem;
  }
</style>
