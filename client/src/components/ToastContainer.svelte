<script>
  import { toasts, dismissToast } from '../stores/toast.js';
  import { flip } from 'svelte/animate';
  import { fly } from 'svelte/transition';
</script>

<div class="toast-container">
  {#each $toasts as t (t.id)}
    <div 
      class="toast {t.type}" 
      animate:flip={{duration: 300}}
      transition:fly={{ y: 20, duration: 300 }}
    >
      <span class="message">{t.message}</span>
      <button class="close-btn" onclick={() => dismissToast(t.id)} aria-label="Cerrar">✕</button>
    </div>
  {/each}
</div>

<style>
  .toast-container {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    max-width: 320px;
  }

  .toast {
    padding: 1rem 1.25rem;
    border-radius: 12px;
    background: var(--surface-color);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    color: var(--text-color);
  }

  .toast.success {
    border-left-color: #2ed573;
    border-left-width: 4px;
  }

  .toast.error {
    border-left-color: #ff4757;
    border-left-width: 4px;
  }

  .toast.info {
    border-left-color: var(--primary-color);
    border-left-width: 4px;
  }

  .message {
    font-size: 0.95rem;
    font-weight: 500;
  }

  .close-btn {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    font-size: 1rem;
    padding: 0;
    line-height: 1;
  }

  .close-btn:hover {
    color: var(--text-color);
  }
</style>
