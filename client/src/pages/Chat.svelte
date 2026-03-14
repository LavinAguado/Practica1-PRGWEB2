<script>
  import { onMount, onDestroy } from 'svelte';
  import { io } from 'socket.io-client';
  import { token, user } from '../stores/auth.js';
  import { navigate } from '../stores/router.js';

  let socket = null;
  let messages = $state([]);
  let currentMsg = $state('');
  let messagesContainer = null;

  onMount(() => {
    if (!$token) {
      navigate('login');
      return;
    }

    // Connect to Socket.IO backend
    socket = io('http://localhost:4000', {
      auth: { token: $token }
    });

    // Handle connection events
    socket.on('connect_error', (err) => {
      console.error('Socket error:', err.message);
      messages.push({ type: 'system', text: `Error de conexión: ${err.message}` });
      messages = [...messages];
    });

    socket.on('userConnected', (username) => {
      messages.push({ type: 'system', text: `🟢 ${username} se ha conectado.` });
      messages = [...messages];
    });

    socket.on('userDisconnected', (username) => {
      messages.push({ type: 'system', text: `🔴 ${username} se desconectó.` });
      messages = [...messages];
    });

    // Handle incoming broadcast messages
    socket.on('chatMessage', (data) => {
      messages.push({
        type: data.username === $user?.username ? 'self' : 'other',
        username: data.username,
        text: data.message,
        time: new Date(data.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      messages = [...messages];
      scrollToBottom();
      
      // Bot Logic requested by user:
      // If someone else sends a message, or even if self sends it, we can trigger a Bot response locally
      // For a better experience, we only trigger the bot if the current user sent the message,
      // simulating a customer support agent.
      if (data.username === $user?.username) {
        triggerBotResponse(data.message);
      }
    });

    // Welcome System Message
    messages.push({ type: 'system', text: 'Bienvenido al Chat de Soporte.' });
  });

  onDestroy(() => {
    if (socket) socket.disconnect();
  });

  function triggerBotResponse(userMsg) {
    const textLower = userMsg.toLowerCase();
    let reply = "Lo siento, soy un bot de prueba. Por favor contacta al administrador.";
    
    if (textLower.includes('hola') || textLower.includes('buenos')) {
      reply = `¡Hola ${$user.username}! Soy BotSoporte 🤖 ¿En qué te puedo ayudar hoy?`;
    } else if (textLower.includes('pedido') || textLower.includes('comprar')) {
      reply = `Puedes revisar tus pedidos anteriores desde la pestaña "Mi Perfil" o usar el Carrito para tramitar una nueva compra. 🛍️`;
    } else if (textLower.includes('producto') || textLower.includes('stock')) {
      reply = `Los detalles de stock y precios siempre están actualizados en la pestaña Productos. ¿Buscas algo en concreto?📦`;
    } else if (textLower.includes('gracias')) {
      reply = `¡De nada! Aquí estoy siempre para ayudarte. 😊`;
    }

    // Simulate typing delay
    setTimeout(() => {
      messages.push({
        type: 'other',
        username: 'BotSoporte 🤖',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      messages = [...messages];
      scrollToBottom();
    }, 1200);
  }

  function sendMessage(e) {
    e.preventDefault();
    if (currentMsg.trim() && socket) {
      // The socket emits the message to the backend which broadcasts it back to everyone
      socket.emit('chatMessage', {
        username: $user.username,
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
      <h2>Soporte en Línea</h2>
      <p>Conectado como <strong>{$user?.username}</strong></p>
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
    </div>

    <form class="chat-input" onsubmit={sendMessage}>
      <input 
        type="text" 
        bind:value={currentMsg} 
        placeholder="Escribe un mensaje al soporte..." 
        autocomplete="off"
      />
      <button type="submit" class="btn-primary" disabled={!currentMsg.trim()}>Enviar</button>
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
  }

  .chat-container {
    width: 100%;
    max-width: 700px;
    height: 100%;
    max-height: 800px;
    background: var(--surface-color);
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.05);
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
  }

  .chat-header {
    padding: 1.5rem;
    background: rgba(0,0,0,0.2);
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }

  .chat-header h2 {
    margin: 0;
    color: var(--primary-color);
    font-size: 1.3rem;
  }
  
  .chat-header p {
    margin: 0.2rem 0 0 0;
    font-size: 0.85rem;
    color: var(--text-muted);
  }

  .messages {
    flex: 1;
    padding: 1.5rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .system-msg {
    align-self: center;
    font-size: 0.8rem;
    color: var(--text-muted);
    background: rgba(255,255,255,0.05);
    padding: 0.3rem 0.8rem;
    border-radius: 12px;
  }

  .message {
    display: flex;
    flex-direction: column;
    max-width: 75%;
  }

  .message.self {
    align-self: flex-end;
  }

  .message.other {
    align-self: flex-start;
  }

  .msg-header {
    display: flex;
    gap: 0.5rem;
    align-items: baseline;
    margin-bottom: 0.3rem;
    padding: 0 0.2rem;
  }

  .message.self .msg-header {
    flex-direction: row-reverse;
  }

  .user {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text-muted);
  }

  .time {
    font-size: 0.75rem;
    color: rgba(255,255,255,0.3);
  }

  .bubble {
    padding: 0.8rem 1.2rem;
    border-radius: 16px;
    color: white;
    font-size: 0.95rem;
    line-height: 1.4;
  }

  .self .bubble {
    background: var(--primary-color);
    border-bottom-right-radius: 4px;
    box-shadow: 0 4px 15px rgba(88, 166, 255, 0.2);
  }

  .other .bubble {
    background: rgba(255,255,255,0.1);
    border-bottom-left-radius: 4px;
    border: 1px solid rgba(255,255,255,0.05);
  }

  .chat-input {
    display: flex;
    padding: 1.2rem;
    gap: 1rem;
    background: rgba(0,0,0,0.2);
    border-top: 1px solid rgba(255,255,255,0.05);
  }

  .chat-input input {
    flex: 1;
    padding: 0.8rem 1.2rem;
    border-radius: 20px;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(0,0,0,0.3);
    color: white;
    font-family: inherit;
    font-size: 1rem;
  }

  .chat-input input:focus {
    outline: none;
    border-color: var(--primary-color);
  }

  .chat-input button {
    padding: 0 1.5rem;
    border-radius: 20px;
    border: none;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .chat-input button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
