import { Product, Partner } from '@/types';

export const products: Product[] = [
  {
    id: 'mug-01',
    name: 'Taza Cerámica Clásica',
    category: 'tazas',
    description: 'Taza de cerámica de alta calidad, 325ml. Perfecta para sublimación con colores vibrantes y duraderos.',
    basePrice: 200,
    images: [
      {
        color: 'Blanco',
        url: 'https://i.ibb.co/vxKKkGCn/Taza-Blanca.png'
      },
      {
        color: 'Negro',
        url: 'https://i.ibb.co/YFP4n9xw/Taza-Negra.png'
      },
      {
        color: 'Rojo',
        url: 'https://i.ibb.co/xt35V9Lc/Taza-Roja.png'
      },
      {
        color: 'Azul',
        url: 'https://i.ibb.co/ZppPP9L8/Taza-Azul.png'
      }
    ],
    colors: ['Blanco', 'Negro', 'Rojo', 'Azul'],
    rating: 4.8,
    reviews: 234,
    popular: true,
  },
  {
    id: 'mug-02',
    name: 'Taza Mágica',
    category: 'tazas',
    description: 'Taza que cambia de color con el calor. Revela tu diseño al verter líquido caliente.',
    basePrice: 240,
    images: [
      {
        color: 'Blanco',
        url: 'https://i.ibb.co/Xr6fGyG7/Taza-Magica-Blanco.png',
      },
      {
        color: 'Azul',
        url: 'https://i.ibb.co/vxpB564D/Taza-Magica-Azul.png'
      }
    ],
    colors: ['Blanco', 'Azul'],
    rating: 4.9,
    reviews: 189,
    popular: true,
  },
  {
    id: 'shirt-01',
    name: 'Camiseta Premium',
    category: 'ropa',
    description: 'Camiseta 100% poliéster de alto rendimiento. Ideal para sublimación con máxima definición de color.',
    basePrice: 350,
    images: [
      {
        color: 'Blanco',
        url: 'https://i.ibb.co/7NN8FBkD/Camisa-Premium-Blanca.png'
      },
      {
        color: 'Gris claro',
        url: 'https://i.ibb.co/whTxysC5/Camisa-Premium-Gris.png'
      },
      {
        color: 'Crema',
        url: 'https://i.ibb.co/Y7Q3CtM7/Camisa-Premium-Beige.png'
      }
    ],
    colors: ['Blanco', 'Gris claro', 'Crema'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    rating: 4.7,
    reviews: 412,
    popular: true,
  },
  {
    id: 'shirt-02',
    name: 'Camiseta Algodón Sublimable',
    category: 'ropa',
    description: 'Mezcla especial 65% poliéster / 35% algodón. Suavidad del algodón con la vibrancia de la sublimación.',
    basePrice: 220,
    images: [
      {
        color: 'Blanco',
        url: 'https://i.ibb.co/sdx5bK7p/Camisa-Blanco.png'
      },
      {
        color: 'Gris',
        url: 'https://i.ibb.co/XxSkkHTD/Camisa-Gris.png'
      },
      {
        color: 'Beige',
        url: 'https://i.ibb.co/fzFrj2nT/Camisa-Beige.png'
      }
    ],
    colors: ['Blanco', 'Gris', 'Beige'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    rating: 4.6,
    reviews: 156,
  },
  {
    id: 'case-01',
    name: 'Funda iPhone Sublimable',
    category: 'accesorios',
    description: 'Funda rígida con acabado brillante. Compatible con modelos iPhone 12-15.',
    basePrice: 300,
    images: [
      {
        color: 'Transparente',
        url: 'https://i.ibb.co/8LTzNRBN/IPhone-Case-Transparente.png'
      },
      {
        color: 'Blanco',
        url: 'https://i.ibb.co/7x4FMPVk/IPhone-Case-Blanco.png'
      },
      {
        color: 'Negro',
        url: 'https://i.ibb.co/Kj1rD3CX/IPhone-Case-Negro.png'
      }
    ],
    colors: ['Transparente', 'Blanco', 'Negro'],
    rating: 4.5,
    reviews: 98,
  },
  {
    id: 'case-02',
    name: 'Funda Samsung Galaxy',
    category: 'accesorios',
    description: 'Funda de policarbonato resistente. Modelos S21-S24 Ultra disponibles.',
    basePrice: 300,
    images: [
      {
        color: 'Negro',
        url: 'https://i.ibb.co/bjVmkgz0/Samsung-Case-Negro.png'
      },
      {
        color: 'Rosa',
        url: 'https://i.ibb.co/b5k7w7gr/Samsung-Case-Rosa.png'
      },
      {
        color: 'Amarillo',
        url: 'https://i.ibb.co/0RJ1tGVG/Samsung-Case-Amarillo.png'
      },
    ],
    colors: ['Negro', 'Rosa', 'Amarillo'],
    rating: 4.4,
    reviews: 67,
  },
  {
    id: 'mousepad-01',
    name: 'Mousepad XL Gaming',
    category: 'accesorios',
    description: 'Mousepad 80x30cm con base antideslizante. Superficie optimizada para sublimación.',
    basePrice: 130,
    images: [
      {
        color: 'Negro',
        url: 'https://i.ibb.co/1GWB29Td/Mousepad-Negro.png'
      },
      {
        color: 'Blanco',
        url: 'https://i.ibb.co/tPmMxGxm/Mousepad-Blanco.png'
      }
    ],
    colors: ['Negro', 'Blanco'],
    rating: 4.7,
    reviews: 312,
    popular: true,
  },
  {
    id: 'bottle-01',
    name: 'Botella Térmica 500ml',
    category: 'hogar',
    description: 'Botella de acero inoxidable con recubrimiento sublimable. Mantiene temperatura 12h.',
    basePrice: 600,
    images: [
      {
        color: 'Rojo',
        url: 'https://i.ibb.co/bgSmGgBh/Botella-Rojo.png'
      },
      {
        color: 'Plateado',
        url: 'https://i.ibb.co/QjDRyj2n/Botella-Plateado.png'
      },
      {
        color: 'Negro',
        url: 'https://i.ibb.co/pcskXxz/Botella-Negro.png'
      }
    ],
    colors: ['Rojo', 'Plateado', 'Negro'],
    rating: 4.8,
    reviews: 178,
    popular: true,
  },
  {
    id: 'pillow-01',
    name: 'Cojín Decorativo 40x40',
    category: 'hogar',
    description: 'Funda de poliéster con cremallera invisible. Incluye relleno de fibra.',
    basePrice: 180,
    images: [
      {
        color: 'Blanco',
        url: 'https://i.ibb.co/qYb4PMsv/Almohada-Blanco.png'
      },
      {
        color: 'Crudo',
        url: 'https://i.ibb.co/V0HSxZqT/Almohada-Crudo.png'
      },
      {
        color: 'Negro',
        url: 'https://i.ibb.co/5WX2G8Vm/Almohada-Negro.png'
      }
    ],
    colors: ['Blanco', 'Crudo', 'Negro'],
    rating: 4.6,
    reviews: 89,
  },
  {
    id: 'totebag-01',
  name: 'Totebag Personalizada',
  category: 'accesorios',
  description: 'Totebag de tela resistente y reutilizable. Ideal para diseños personalizados, logos, frases o ilustraciones. Acabado moderno y cómodo para uso diario.',
  basePrice: 280.00,
  images: [
    {
      color: 'Blanco',
      url: 'https://i.ibb.co/QjCgTvWV/Tote-Blanco.png'
    },
    {
      color: 'Negro',
      url: 'https://i.ibb.co/2wK9yRJ/Tote-Negro.png'
    },
    {
      color: 'Beige',
      url: 'https://i.ibb.co/MxZ7PqN0/Tote-Beige.png'
    }
  ],
  colors: ['Blanco', 'Negro', 'Beige'],
  rating: 4.9,
  reviews: 145,
  popular: true,
  },
  {
    id: 'gorra-01',
    name: 'Gorra Personalizada',
    category: 'accesorios',
    description: 'Gorra sublimable de alta calidad, cómoda y ajustable. Ideal para diseños personalizados, logos o frases. Material resistente con acabado moderno y duradero.',
    basePrice: 250,
    images:
      [
        {
          color: 'Negro',
          url: 'https://resources.claroshop.com/medios-plazavip/mkt/64ab4fd7ba903_frente_negro_dnjpg.jpg?scale=500&qlty=75'
        }
      ],
   colors: ['Negro'],
    rating: 4.8,
   reviews: 98,
   popular: true,
   },
];

export const partners: Partner[] = [
  {
    id: 'prt-001',
    name: 'SublimaPro Norte',
    specialty: ['tazas', 'accesorios'],
    capacity: 'high',
    rating: 4.9,
    location: 'Norte',
    active: true,
  },
  {
    id: 'prt-002',
    name: 'PrintMaster Chinandega',
    specialty: ['ropa', 'hogar'],
    capacity: 'high',
    rating: 4.8,
    location: 'Chinandega',
    active: true,
  },
  {
    id: 'prt-003',
    name: 'ColorVibe Leon',
    specialty: ['regalos', 'accesorios'],
    capacity: 'medium',
    rating: 4.7,
    location: 'Leon',
    active: true,
  },
  {
    id: 'prt-004',
    name: 'SublimArt Managua',
    specialty: ['tazas', 'hogar'],
    capacity: 'medium',
    rating: 4.6,
    location: 'Managua',
    active: true,
  },
  {
    id: 'prt-005',
    name: 'NicFusion Managua',
    specialty: ['ropa'],
    capacity: 'low',
    rating: 4.5,
    location: 'Managua',
    active: false,
  },
];

export const categories = [
  { id: 'all', name: 'Todos', icon: 'Grid3X3' },
  { id: 'tazas', name: 'Tazas', icon: 'Coffee' },
  { id: 'ropa', name: 'Ropa', icon: 'Shirt' },
  { id: 'accesorios', name: 'Accesorios', icon: 'Smartphone' },
  { id: 'hogar', name: 'Hogar', icon: 'Home' },
  { id: 'regalos', name: 'Regalos', icon: 'Gift' },
];
