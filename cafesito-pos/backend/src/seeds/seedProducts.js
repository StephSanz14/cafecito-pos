import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Product } from '../models/product.js';

dotenv.config();

async function seed() {
  if (!process.env.MONGODB_URI || !process.env.MONGODB_DB) {
    throw new Error('Faltan variables MONGODB_URI o MONGODB_DB en .env');
  }

  const uri = `${process.env.MONGODB_URI}/${process.env.MONGODB_DB}`;

  await mongoose.connect(uri);
  console.log('✅ Conectado a Mongo');

  await Product.deleteMany();
  console.log('🗑️ Colección products limpiada');

  await Product.insertMany(products);
  console.log(`🌱 Insertados ${products.length} productos`);

  await mongoose.disconnect();
  console.log('👋 Seed terminado');
}
const products = [
  // Cafés clásicos
  { name: "Café Americano", price: 35, stock: 60 },
  { name: "Café Espresso", price: 30, stock: 50 },
  { name: "Espresso Doble", price: 38, stock: 45 },
  { name: "Café Cortado", price: 38, stock: 35 },
  { name: "Café Latte", price: 45, stock: 40 },
  { name: "Capuccino", price: 48, stock: 35 },
  { name: "Café Mocha", price: 52, stock: 30 },
  { name: "Macchiato", price: 46, stock: 25 },
  { name: "Flat White", price: 49, stock: 22 },
  { name: "Affogato", price: 58, stock: 18 },

  // Especialidad / sabores
  { name: "Latte Vainilla", price: 55, stock: 25 },
  { name: "Latte Caramelo", price: 55, stock: 25 },
  { name: "Latte Avellana", price: 57, stock: 20 },
  { name: "Mocha Blanco", price: 58, stock: 20 },
  { name: "Latte Canela", price: 52, stock: 22 },
  { name: "Latte Cajeta", price: 60, stock: 18 },
  { name: "Latte Moka Oscuro", price: 60, stock: 18 },
  { name: "Café Olla", price: 42, stock: 35 },
  { name: "Café Olla con Piloncillo", price: 45, stock: 30 },
  { name: "Café Olla con Canela", price: 45, stock: 30 },

  // Fríos (iced)
  { name: "Iced Americano", price: 40, stock: 35 },
  { name: "Iced Latte", price: 50, stock: 28 },
  { name: "Iced Vainilla Latte", price: 58, stock: 22 },
  { name: "Iced Caramelo Latte", price: 58, stock: 22 },
  { name: "Cold Brew", price: 55, stock: 25 },
  { name: "Cold Brew Vainilla", price: 62, stock: 18 },
  { name: "Cold Brew Naranja", price: 65, stock: 15 },
  { name: "Frappé Café", price: 65, stock: 25 },
  { name: "Frappé Mocha", price: 70, stock: 20 },
  { name: "Frappé Caramelo", price: 70, stock: 20 },

  // Tés / infusiones
  { name: "Té Chai", price: 48, stock: 30 },
  { name: "Chai Latte", price: 58, stock: 24 },
  { name: "Té Verde", price: 40, stock: 30 },
  { name: "Té Negro", price: 40, stock: 30 },
  { name: "Té Manzanilla", price: 38, stock: 30 },
  { name: "Té Hierbabuena", price: 38, stock: 30 },
  { name: "Tisana Frutos Rojos", price: 45, stock: 22 },
  { name: "Tisana Mango", price: 45, stock: 22 },
  { name: "Matcha Latte", price: 68, stock: 18 },
  { name: "Matcha Iced Latte", price: 72, stock: 15 },

  // Chocolate / bebidas calientes
  { name: "Chocolate Caliente", price: 45, stock: 25 },
  { name: "Chocolate Abuelita", price: 48, stock: 22 },
  { name: "Chocolate con Malvaviscos", price: 55, stock: 18 },
  { name: "Chocolate Blanco", price: 55, stock: 18 },
  { name: "Leche Caliente con Canela", price: 35, stock: 20 },

  // Pan dulce / repostería
  { name: "Pan Dulce", price: 20, stock: 40 },
  { name: "Concha Vainilla", price: 22, stock: 35 },
  { name: "Concha Chocolate", price: 22, stock: 35 },
  { name: "Oreja", price: 25, stock: 30 },
  { name: "Cuernito", price: 28, stock: 28 },
  { name: "Cuernito de Mantequilla", price: 32, stock: 24 },
  { name: "Rol de Canela", price: 38, stock: 20 },
  { name: "Brownie", price: 28, stock: 25 },
  { name: "Brownie con Nuez", price: 32, stock: 20 },
  { name: "Galleta Chispas Chocolate", price: 18, stock: 35 },

  // Postres / bakery más “cafetería”
  { name: "Cheesecake", price: 65, stock: 12 },
  { name: "Cheesecake Fresa", price: 70, stock: 10 },
  { name: "Pastel Chocolate", price: 70, stock: 10 },
  { name: "Pastel Zanahoria", price: 68, stock: 10 },
  { name: "Muffin Chocolate", price: 35, stock: 18 },
  { name: "Muffin Arándano", price: 35, stock: 18 },
  { name: "Pay Limón", price: 60, stock: 12 },
  { name: "Pay Queso", price: 60, stock: 12 },

  // Salado / snacks
  { name: "Sandwich Jamón y Queso", price: 55, stock: 18 },
  { name: "Panini Pollo", price: 75, stock: 12 },
  { name: "Panini Pesto", price: 78, stock: 10 },
  { name: "Croissant Jamón y Queso", price: 60, stock: 14 },
  { name: "Baguette Italiano", price: 85, stock: 10 },
  { name: "Chapata Vegetariana", price: 80, stock: 10 },
  { name: "Papas Chips", price: 20, stock: 40 },
];

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Error en seed:', err);
    process.exit(1);
  });