# 🎨 SubliNet

> **Conectamos tu creatividad con la mejor tecnología de sublimación.**

SubliNet es una plataforma web que conecta a usuarios que buscan sublimar sus diseños con empresas de sublimación asociadas. El cliente sube su diseño, elige un producto, paga y SubliNet se encarga de todo el proceso interno de asignación a los socios.

---

## 📁 Estructura del Proyecto

```
sublinet/
├── public/                     # Archivos estáticos
│   ├── images/
│   └── mockups/
│
├── src/
│   ├── components/             # Componentes reutilizables
│   │   ├── Navbar.tsx           # Barra de navegación con carrito y auth
│   │   ├── Footer.tsx           # Pie de página
│   │   ├── ProductCard.tsx      # Tarjeta de producto en catálogo
│   │   └── DesignUploader.tsx   # Componente de subida de diseños con preview
│   │
│   ├── pages/                  # Páginas principales (rutas)
│   │   ├── HomePage.tsx         # Landing page con hero, cómo funciona, populares
│   │   ├── CatalogPage.tsx      # Catálogo con filtros y búsqueda
│   │   ├── ProductDetailPage.tsx # Detalle de producto + subida de diseño
│   │   ├── CartPage.tsx         # Carrito de compras + checkout
│   │   ├── OrdersPage.tsx       # Seguimiento de pedidos del cliente
│   │   ├── LoginPage.tsx        # Inicio de sesión (demo)
│   │   └── AdminPage.tsx        # Panel de administración (socios, pedidos)
│   │
│   ├── context/                # Contextos de React (estado global)
│   │   ├── CartContext.tsx      # Estado del carrito de compras
│   │   └── AuthContext.tsx      # Estado de autenticación
│   │
│   ├── data/                   # Datos mock/demo
│   │   └── products.ts          # Productos, categorías y socios
│   │
│   ├── types/                  # Tipos de TypeScript
│   │   └── index.ts             # Interfaces: Product, CartItem, Order, Partner, User
│   │
│   ├── utils/                  # Utilidades
│   │   └── helpers.ts           # formatPrice, formatDate, getStatusColor, cn
│   │
│   ├── App.tsx                  # Router principal con todas las rutas
│   ├── main.tsx                 # Punto de entrada (render React)
│   └── index.css                # Tailwind directives + estilos globales
│
├── index.html                   # HTML base
├── package.json                 # Dependencias y scripts
├── vite.config.ts               # Configuración de Vite
├── tsconfig.json                # Configuración de TypeScript
├── tailwind.config.js           # Configuración de Tailwind (colores brand)
├── postcss.config.js            # PostCSS con Tailwind y Autoprefixer
└── README.md                    # Este archivo
```

---

## 🚀 Cómo ejecutar

### Requisitos
- Node.js 18+
- npm o yarn

### Instalación

```bash
# 1. Navegar al directorio
cd sublinet

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev
```

La aplicación se abrirá en `http://localhost:3000`

---

## 🔑 Credenciales de Demo

| Rol      | Correo                | Contraseña |
|----------|----------------------|------------|
| Cliente  | `cliente@demo.com`   | `demo123`  |
| Admin    | `admin@sublinet.com` | `admin123` |

---

## 🗺️ Rutas de la Aplicación

| Ruta              | Página                  | Acceso     |
|-------------------|------------------------|------------|
| `/`               | Home (Landing)         | Público    |
| `/catalogo`       | Catálogo de productos  | Público    |
| `/producto/:id`   | Detalle de producto    | Público    |
| `/carrito`        | Carrito de compras     | Público    |
| `/pedidos`        | Mis pedidos            | Público    |
| `/login`          | Iniciar sesión         | Público    |
| `/admin`          | Panel de administración| Solo Admin |

---

## 🎨 Modelo de Negocio: Marketplace Opaco

SubliNet opera como un **marketplace opaco (white-label)**:

1. **El cliente** ve solo la marca SubliNet
2. **SubliNet** recibe el pedido y el diseño
3. **Internamente**, el admin asigna el pedido al socio de sublimación más adecuado según:
   - Ubicación geográfica
   - Especialidad del producto
   - Capacidad de producción
   - Calificación
4. **El socio** produce y envía bajo marca SubliNet
5. **El cliente** recibe el producto sin saber quién lo fabricó

**Ventajas del modelo opaco:**
- Control total de la marca y experiencia del cliente
- Precios unificados, sin competencia entre socios
- El cliente no puede saltarse a SubliNet para ir directo al socio
- Flexibilidad para cambiar socios sin afectar al cliente

---

## 🛠️ Stack Tecnológico

| Tecnología      | Uso                              |
|-----------------|----------------------------------|
| React 19        | Framework UI                     |
| TypeScript      | Tipado estático                  |
| Vite            | Build tool y dev server          |
| Tailwind CSS 3  | Estilos utilitarios              |
| React Router 7  | Navegación SPA                   |
| Lucide React    | Iconos                           |

---

## 📦 Funcionalidades Incluidas

- ✅ Landing page con hero animado y estadísticas
- ✅ Catálogo de productos con filtros por categoría, búsqueda y ordenamiento
- ✅ Página de detalle de producto con selección de color/talla
- ✅ **Subida de diseños** con preview en mockup del producto
- ✅ Carrito de compras persistente (contexto React)
- ✅ Checkout con formulario de envío y confirmación
- ✅ Seguimiento de pedidos con barra de progreso visual
- ✅ Sistema de autenticación (cliente / admin)
- ✅ **Panel de administración** con:
  - Dashboard con estadísticas
  - Gestión de pedidos y asignación a socios
  - Vista de red de socios (solo admin)
- ✅ Diseño responsive (mobile-first)
- ✅ Animaciones con Tailwind

---

## 🔮 Próximos pasos sugeridos

- [ ] Integrar backend real (API REST/GraphQL)
- [ ] Sistema de pagos (Stripe, MercadoPago)
- [ ] Editor de diseños integrado (Canvas/fabric.js)
- [ ] Notificaciones por email/SMS
- [ ] Sistema de reseñas y calificaciones
- [ ] Panel de socios (login propio para sublimadores)
- [ ] Integración con servicios de envío (FedEx, DHL)
- [ ] Analytics y reportes avanzados

---

**© 2026 SubliNet** — Prototipo funcional desarrollado con ❤️
