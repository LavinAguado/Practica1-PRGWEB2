# 🛒 Portal de Productos E-Commerce - Svelte 5

Este proyecto es una aplicación web full-stack (MEVN stack simplificado con Svelte) que implementa un portal de productos completo con autenticación JWT, gestión de roles, carrito de compras, chat en vivo y un panel de administración avanzado.

## 🚀 Instalación y Ejecución

### Requisitos Previos
- Node.js (v18 o superior recomendado)
- MongoDB corriendo localmente (puerto 27017) o una URI de MongoDB Atlas.

### 1. Configuración del Backend
Desde la raíz del proyecto:
1. Instala las dependencias:
   ```bash
   npm install
   ```
2. Configura las variables de entorno:
   Crea un archivo `.env` o edita `config.js` (si no usas .env):
   ```env
   PORT=4000
   MONGO_URI=mongodb://localhost:27017/practica1
   JWT_SECRET=tu_secreto_super_seguro
   ```
3. Inicia el servidor:
   ```bash
   npm run dev
   ```
   *El servidor correrá en [http://localhost:4000](http://localhost:4000)*

### 2. Configuración del Frontend
Desde la carpeta `client`:
1. Instala las dependencias:
   ```bash
   cd client
   npm install
   ```
2. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   *La aplicación estará disponible en [http://localhost:5173](http://localhost:5173)*

---

## 🔑 Credenciales de Prueba (Demo)

Para probar los diferentes roles de la aplicación sin necesidad de registrarse:

- **Administrador**:
  - **Email**: `admin@admin.com`
  - **Password**: `admin`
- **Usuario Estándar**:
  - **Email**: `prueba@prueba.com`
  - **Password**: `user`

---

## ⚡ Svelte 5: Uso de Runas y APIs

Este proyecto hace un uso extensivo de las nuevas APIs de Svelte 5 para una reactividad más eficiente y un código más limpio.

### Runas Utilizadas
- **`$state()`**: Utilizado para manejar el estado principal reactivo.
  - *Ejemplos*: `products`, `loading`, `searchTerm`, `formProduct`, `selectedQuantities` en `Products.svelte`.
- **`$derived()`**: Utilizado para valores que dependen de otros estados, optimizando los cálculos.
  - *Ejemplos*: `filteredProducts`, `productCount`, `isAdmin`, `totalValue` (en el carrito) y `userDisplayName`.
- **`$effect()`**: Manejo de efectos secundarios y sincronización.
  - *Ejemplos*: Redirección automática si desaparece el token (Auth Guard en `App.svelte`), sincronización de datos al cambiar el rol del usuario, y restauración de sesión desde `localStorage`.
- **`$props()`**: Definición declarativa de propiedades en componentes.
  - *Ejemplos*: `ProductCard.svelte` y `ProductForm.svelte` reciben sus datos y callbacks mediante esta runa.

### Comunicación entre Componentes
- Se han sustituido los eventos personalizados clásicos por el uso de **callbacks** pasados como props, siguiendo el patrón recomendado en Svelte 5.
  - *Ejemplos*: `onSave`, `onEdit`, `onDelete`, `onAddToCart` son funciones pasadas desde `Products.svelte` a sus componentes hijos.

---

## 🛠️ Backend: Endpoints y Roles

El backend está construido con Express y ofrece una API REST para auth/productos/usuarios y GraphQL para pedidos.

### Autenticación (`/api/auth`)
- `POST /register`: Registro de nuevos usuarios.
- `POST /login`: Inicio de sesión (devuelve JWT y datos del usuario).

### Productos (`/api/products`)
- `GET /`: Listar productos (Cualquier usuario autenticado).
- `POST /`: Crear producto (**Solo Admin**).
- `PUT /:id`: Editar producto (**Solo Admin**).
- `DELETE /:id`: Eliminar producto (**Solo Admin**).

### Usuarios (`/api/users`)
- `GET /`: Listar todos los usuarios (**Solo Admin**).
- `PUT /:id/role`: Cambiar rol de un usuario (**Solo Admin**).
- `DELETE /:id`: Eliminar usuario (**Solo Admin**).

### Pedidos (GraphQL - `/graphql`)
- **Mutations**: `createOrder(items)` -> Crea un pedido restando stock.
- **Queries**: `myOrders` -> Lista pedidos del usuario. `orders` (**Solo Admin**) -> Lista todos los pedidos.

---

## ✨ Funcionalidades Avanzadas Implementadas

1. **Gestión de Roles**: Panel de administración completo para gestionar usuarios.
2. **Persistencia de Sesión**: Los datos del usuario y el JWT persisten en `localStorage`.
3. **Filtros Avanzados**: Buscador por nombre y filtrado por rango de precios reactivo.
4. **Validación de Formularios**: Control de errores en tiempo real y feedback visual.
5. **UX Mejorada**: 
   - Sistema de **Notificaciones Toast** global.
   - **Spinners de carga** profesionales.
   - **Flujo de Registro**: Alternancia entre Login y Registro en la misma vista, con validación de contraseñas y asignación automática de rol `user`.
   - Confirmación de acciones destructivas.
   - Chat interactivo con respuestas automáticas (Bot).
