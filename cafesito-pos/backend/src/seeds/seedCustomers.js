import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { Customer } from '../models/customer.js';

dotenv.config();

async function seed() {
  if (!process.env.MONGODB_URI || !process.env.MONGODB_DB) {
    throw new Error('Faltan variables MONGODB_URI o MONGODB_DB en .env');
  }

  const uri = `${process.env.MONGODB_URI}/${process.env.MONGODB_DB}`;
  
  await mongoose.connect(uri);
  console.log('✅ Conectado a Mongo');

  // 👇 SOLO customers (no toca products)
  await Customer.deleteMany();
  console.log('🗑️ Colección customers limpiada');

  const hashed = await bcrypt.hash('Abc123', 10);

  const customers = [
    // Admin / Seller (con password Abc123)
    { name: 'Admin Cafecito', phoneOrEmail: 'admin@cafecito.com', role: 'admin', purchasesCount: 0, password: hashed },
    { name: 'Seller Uno', phoneOrEmail: 'seller1@cafecito.com', role: 'seller', purchasesCount: 0, password: hashed },
    { name: 'Seller Dos', phoneOrEmail: 'seller2@cafecito.com', role: 'seller', purchasesCount: 0, password: hashed },

    // Customers (SIN password) + purchasesCount variados
    { name: 'Oziel Tovar', phoneOrEmail: '+524491235454', role: 'customer', purchasesCount: 0 },
    { name: 'Ana López', phoneOrEmail: '+524499773850', role: 'customer', purchasesCount: 1 },
    { name: 'Luis Moreno', phoneOrEmail: '+524491112233', role: 'customer', purchasesCount: 2 },
    { name: 'María Fernanda', phoneOrEmail: '+524492223344', role: 'customer', purchasesCount: 3 },

    { name: 'Carlos Ramírez', phoneOrEmail: '+524493334455', role: 'customer', purchasesCount: 4 },
    { name: 'Dulce Hernández', phoneOrEmail: '+524494445566', role: 'customer', purchasesCount: 5 },
    { name: 'Fernando Cruz', phoneOrEmail: '+524495556677', role: 'customer', purchasesCount: 6 },
    { name: 'Valeria Soto', phoneOrEmail: '+524496667788', role: 'customer', purchasesCount: 7 },

    { name: 'Jorge Medina', phoneOrEmail: '+524497778899', role: 'customer', purchasesCount: 8 },
    { name: 'Karla Jiménez', phoneOrEmail: '+524498889900', role: 'customer', purchasesCount: 9 },
    { name: 'Paola Reyes', phoneOrEmail: '+524490001122', role: 'customer', purchasesCount: 10 },
    { name: 'Ricardo Flores', phoneOrEmail: '+524490112233', role: 'customer', purchasesCount: 12 },

    // emails customer también (sin password)
    { name: 'Sofía Martínez', phoneOrEmail: 'sofia@gmail.com', role: 'customer', purchasesCount: 0 },
    { name: 'Diego Vargas', phoneOrEmail: 'diego@gmail.com', role: 'customer', purchasesCount: 2 },
    { name: 'Camila Pérez', phoneOrEmail: 'camila@gmail.com', role: 'customer', purchasesCount: 6 },
    { name: 'Bruno Aguilar', phoneOrEmail: 'bruno@gmail.com', role: 'customer', purchasesCount: 9 },
  ];

  await Customer.insertMany(customers);
  console.log(`🌱 Insertados ${customers.length} customers`);

  await mongoose.disconnect();
  console.log('👋 Seed customers terminado');
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Error en seed customers:', err);
    process.exit(1);
  });