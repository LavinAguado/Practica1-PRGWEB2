<script>
  import { onMount, onDestroy } from 'svelte';
  import { io } from 'socket.io-client';
  import { auth } from '../stores/auth.svelte.js';
  import { router, navigate } from '../stores/router.svelte.js';

  let socket = null;
  let messages = $state([]);
  let currentMsg = $state('');
  let messagesContainer = null;
  let isTyping = $state(false);

  onMount(() => {
    if (!auth.token) {
      navigate('login');
      return;
    }

    // Connect to Socket.IO backend
    socket = io('http://localhost:4000', {
      auth: { token: auth.token }
    });

    // Handle connection events
    socket.on('connect_error', (err) => {
      console.error('Socket error:', err.message);
      messages = [...messages, { type: 'system', text: `Error de conexión: ${err.message}` }];
    });

    socket.on('userConnected', (username) => {
      messages = [...messages, { type: 'system', text: `🟢 ${username} se ha conectado.` }];
    });

    socket.on('userDisconnected', (username) => {
      messages = [...messages, { type: 'system', text: `🔴 ${username} se desconectó.` }];
    });

    // Handle incoming broadcast messages
    socket.on('chatMessage', (data) => {
      messages = [...messages, {
        type: data.username === auth.user?.username ? 'self' : 'other',
        username: data.username,
        text: data.message,
        time: new Date(data.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }];
      scrollToBottom();
      
      // Bot Logic requested by user:
      if (data.username === auth.user?.username) {
        triggerBotResponse(data.message);
      }
    });

    // Welcome System Message
    messages = [...messages, { type: 'system', text: 'Bienvenido al Chat de Soporte.' }];
  });

  onDestroy(() => {
    if (socket) socket.disconnect();
  });

  function triggerBotResponse(userMsg) {
    const textLower = userMsg.toLowerCase();
    let reply = "Lo siento, soy un bot de prueba. Por favor contacta al administrador.";
    
    if (textLower.includes('hola') || textLower.includes('buenos')) {
      reply = `¡Hola ${auth.user.username}! Soy BotSoporte 🤖 ¿En qué te puedo ayudar hoy?`;
    } else if (textLower.includes('pedido') || textLower.includes('comprar')) {
      reply = `Puedes revisar tus pedidos anteriores desde la pestaña "Mi Perfil" o usar el Carrito para tramitar una nueva compra. 🛍️`;
    } else if (textLower.includes('producto') || textLower.includes('stock')) {
      reply = `Los detalles de stock y precios siempre están actualizados en la pestaña Productos. ¿Buscas algo en concreto?📦`;
    } else if (textLower.includes('gracias')) {
      reply = `¡De nada! Aquí estoy siempre para ayudarte. 😊`;
    }

    // Simulate typing delay
    isTyping = true;
    scrollToBottom();

    setTimeout(() => {
      isTyping = false;
      messages = [...messages, {
        type: 'other',
        username: 'BotSoporte 🤖',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }];
      scrollToBottom();
    }, 1500);
  }

  function sendMessage(e) {
    e.preventDefault();
    if (currentMsg.trim() && socket) {
      // The socket emits the message to the backend which broadcasts it back to everyone
      socket.emit('chatMessage', {
        username: auth.user.username,
        message: currentMsg,
        time: new Date().toISOString()
      });
      currentMsg = '';
    }
  }

  function scrollToBottom() {
    setTimeout(() => {
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }, 50);
  }
</script>

<div class="chat-wrapper">
  <div class="chat-container">
    <div class="chat-header">
      <h2>Asistente de Soporte</h2>
      <div class="status-indicator">
        <span class="dot" style="background: #2ed573; animation: none; width: 8px; height: 8px; display: inline-block;"></span>
        <span style="font-size: 0.8rem; color: var(--text-muted); margin-left: 0.5rem;">En línea</span>
      </div>
    </div>

    <div class="messages" bind:this={messagesContainer}>
      {#each messages as msg}
        {#if msg.type === 'system'}
          <div class="system-msg">{msg.text}</div>
        {:else}
          <div class="message {msg.type}">
            <div class="msg-header">
              <span class="user">{msg.username}</span>
              <span class="time">{msg.time}</span>
            </div>
            <div class="bubble">
              {msg.text}
            </div>
          </div>
        {/if}
      {/each}
      
      {#if isTyping}
        <div class="typing-indicator">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
      {/if}
    </div>

    <form class="chat-input" onsubmit={sendMessage}>
      <input 
        type="text" 
        bind:value={currentMsg} 
        placeholder="Escribe un mensaje al soporte..." 
        autocomplete="off"
      />
      <button type="submit" class="btn btn-primary" disabled={!currentMsg.trim()}>Enviar</button>
    </form>
  </div>
</div>

<style>
  .chat-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    height: calc(100vh - 80px);
    background: radial-gradient(circle at bottom right, rgba(var(--primary-color-rgb), 0.05), transparent 40%);
  }

  .chat-container {
    width: 100%;
    max-width: 800px;
    height: 100%;
    max-height: 800px;
    background: rgba(var(--surface-color-rgb, 22, 27, 34), 0.7);
    backdrop-filter: blur(12px) saturate(180%);
    -webkit-backdrop-filter: blur(12px) saturate(180%);
    border-radius: 24px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
  }

  :root.light .chat-container {
    background: rgba(255, 255, 255, 0.7);
    border-color: rgba(0, 0, 0, 0.05);
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  }

  .chat-header {
    padding: 1.5rem 2rem;
    background: rgba(0, 0, 0, 0.2);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  :root.light .chat-header { background: rgba(0, 0, 0, 0.03); }

  .chat-header h2 {
    margin: 0;
    color: var(--primary-color);
    font-size: 1.4rem;
    font-weight: 800;
  }

  .messages {
    flex: 1;
    padding: 2rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    scroll-behavior: smooth;
  }

  .system-msg {
    align-self: center;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-muted);
    background: rgba(255, 255, 255, 0.05);
    padding: 0.4rem 1rem;
    border-radius: 20px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .message {
    display: flex;
    flex-direction: column;
    max-width: 80%;
    animation: fadeIn 0.3s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .message.self { align-self: flex-end; }
  .message.other { align-self: flex-start; }

  .msg-header {
    display: flex;
    gap: 0.6rem;
    align-items: center;
    margin-bottom: 0.4rem;
    padding: 0 0.5rem;
  }

  .message.self .msg-header { flex-direction: row-reverse; }

  .user {
    font-size: 0.8rem;
    font-weight: 700;
    color: var(--text-muted);
  }

  .time {
    font-size: 0.7rem;
    opacity: 0.4;
  }

  .bubble {
    padding: 1rem 1.4rem;
    border-radius: 18px;
    font-size: 1rem;
    line-height: 1.5;
  }

  .self .bubble {
    background: linear-gradient(135deg, var(--primary-color), #3182ce);
    color: white;
    border-bottom-right-radius: 4px;
    box-shadow: 0 8px 20px rgba(var(--primary-color-rgb), 0.25);
  }

  .other .bubble {
    background: rgba(255, 255, 255, 0.1);
    color: var(--text-color);
    border-bottom-left-radius: 4px;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  :root.light .other .bubble { background: #f0f2f5; border: none; }

  .typing-indicator {
    align-self: flex-start;
    padding: 0.8rem 1.2rem;
    background: rgba(255,255,255,0.05);
    border-radius: 18px;
    border-bottom-left-radius: 4px;
    display: flex;
    gap: 4px;
    margin-top: -0.5rem;
  }

  .dot {
    width: 6px;
    height: 6px;
    background: var(--text-muted);
    border-radius: 50%;
    animation: bounce 1.4s infinite ease-in-out both;
  }

  .dot:nth-child(1) { animation-delay: -0.32s; }
  .dot:nth-child(2) { animation-delay: -0.16s; }

  @keyframes bounce {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1.0); }
  }

  .chat-input {
    display: flex;
    padding: 1.5rem 2rem;
    gap: 1rem;
    background: rgba(0, 0, 0, 0.15);
    border-top: 1px solid rgba(255, 255, 255, 0.05);
  }

  .chat-input input {
    flex: 1;
    padding: 1rem 1.5rem;
    border-radius: 14px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.2);
    color: var(--text-color);
    font-size: 1rem;
    transition: all 0.3s;
  }

  :root.light .chat-input input { background: white; border-color: #e1e4e8; }

  .chat-input input:focus {
    outline: none;
    border-color: var(--primary-color);
    background: rgba(0, 0, 0, 0.3);
    box-shadow: 0 0 0 4px rgba(var(--primary-color-rgb), 0.1);
  }

  .chat-input button {
    padding: 0 2rem;
    border-radius: 14px;
    font-weight: 700;
  }
  
  .chat-input button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
