import bcrypt from "bcrypt";
import Customer from "../models/customer.js";
import Product from "../models/product.js";

async function generateCustomers() {
  try {
    const customerCount = await Customer.countDocuments();

    if (customerCount === 0) {
      const defaultCustomers = [
        {
          name: "Admin User",
          emailOrPhone: "admin@cafecitofeliz.com",
          password: await bcrypt.hash("AdminPass123", 10),
          role: "admin",
        },
        {
          name: "John Doe",
          emailOrPhone: "john.doe@example.com",
          password: await bcrypt.hash("Password123", 10),
          role: "customer",
        },
      ];

      await Customer.insertMany(defaultCustomers);
      console.log("Default customers generated");
    } else {
      console.log("Customers already exist, skipping generation");
    }
  } catch (error) {
    console.error("Error generating default customers:", error);
  }
}

async function generateProducts() {
  try {
    const productCount = await Product.countDocuments();

    if (productCount === 0) {
      const defaultProducts = [
        { name: "Café Americano", price: 2.5, stock: 25 },
        { name: "Café Latte", price: 3.5, stock: 30 },
        { name: "Cappuccino", price: 3.0, stock: 20 },
      ];

      await Product.insertMany(defaultProducts);
      console.log("Default products generated");
    } else {
      console.log("Products already exist, skipping generation");
    }
  } catch (error) {
    console.error("Error generating default products:", error);
  }
}

export async function initializeData() {
  try {
    await generateCustomers();
    await generateProducts();
    console.log("Data initialized successfully");
  } catch (error) {
    console.error("Error initializing data:", error);
  }
}
