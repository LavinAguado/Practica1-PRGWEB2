# 🛒 Portal de Productos E-Commerce - Svelte 5 Modernizado

Este proyecto es una aplicación web full-stack premium construida con **Svelte 5**, autenticación JWT, gestión de roles, carrito de compras, chat en vivo y un panel de administración avanzado.

## 🚀 Instalación y Ejecución

### Requisitos Previos
- Node.js (v18 o superior)
- MongoDB corriendo localmente (puerto 27017) o URI de MongoDB Atlas.

### 1. Configuración del Backend
Desde la raíz del proyecto:
1. Instala las dependencias: `npm install`
2. Configura `.env` o `config.js` con:
   ```env
   PORT=4000
   MONGO_URI=mongodb://localhost:27017/practica1
   JWT_SECRET=tu_secreto_seguro
   ```
3. Inicia: `npm run dev`

### 2. Configuración del Frontend
Desde la carpeta `client`:
1. Instala: `npm install`
2. Inicia: `npm run dev` (Disponible en [http://localhost:5173](http://localhost:5173))

## 🔑 Credenciales de Prueba
- **Admin**: `admin@admin.com` / `admin`
- **Usuario**: `prueba@prueba.com` / `user`

---

## ⚡ Svelte 5: Uso de Runas y Componentes

Este proyecto utiliza las nuevas APIs de Svelte 5 para una reactividad más eficiente y un código más limpio:

- **`$state()`**: Utilizado para el estado principal reactivo en módulos globales y componentes.
  - *Ubicación*: `auth.svelte.js`, `cart.svelte.js`, `toast.svelte.js`, `router.svelte.js` (Estado Global). `Products.svelte`, `Login.svelte`, `AdminPanel.svelte` (Estado Local).
- **`$derived()`**: Utilizado para valores calculados automáticamente.
  - *Ubicación*: `Navbar.svelte` (Cálculo del total de items del carrito y estado del usuario). `Products.svelte` (Filtros de búsqueda y precios).
- **`$effect()` / `$effect.root()`**: Sincronización y efectos secundarios.
  - *Ubicación*: `App.svelte` (Guardias de navegación). `cart.svelte.js` (Persistencia en localStorage). `Navbar.svelte` (Sincronización del tema).
- **`$props()`**: Comunicación declarativa entre componentes.
  - *Ubicación*: `ProductCard.svelte`, `ToastContainer.svelte`, `Navbar.svelte`. Se han sustituido los eventos clásicos por **callbacks** pasados como props (ej: `onAddToCart`, `onDelete`).

---

## 🛠️ Backend y Roles

El backend ofrece una combinación de API REST y GraphQL para diferentes funcionalidades:

### Endpoints principales (REST - `/api`)
- **Autenticación (`/auth`)**: `register`, `login`. (Acceso Público).
- **Productos (`/products`)**:
  - `GET /`: Listar productos. (**Rol: Invitado/User/Admin**).
  - `POST /`, `PUT /:id`, `DELETE /:id`: CRUD de productos. (**Rol: Admin**).
- **Usuarios (`/users`)**: `GET /`, `PUT /id/role`, `DELETE /id`. (**Rol: Admin**).
- **Chat (`/chat`)**: Rutas para envío de mensajes y señales de Socket.IO. (**Rol: User/Admin**).

### Pedidos (GraphQL - `/graphql`)
- **Mutation `createOrder`**: Crea un pedido restando stock. (**Rol: User/Admin**).
- **Query `myOrders`**: Lista pedidos del usuario logueado. (**Rol: User/Admin**).
- **Query `orders`**: Lista todos los pedidos de la base de datos. (**Rol: Admin**).

---

## ✨ Funcionalidades Premium
- **Glassmorphism UI**: Diseño basado en cristalinidad y desenfoque.
- **Tema Dinámico**: Selector Light/Dark persistente.
- **Chat Bot**: Indicador de escritura y respuestas automáticas.
- **Transiciones**: Fade-in/out en la navegación SPA.
