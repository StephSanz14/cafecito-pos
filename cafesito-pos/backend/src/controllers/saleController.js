import { Sale } from "../models/sale";
import Product from "../models/product.js";

async function createSale(req, res, next) {
  try {
    const { customerId, items, paymentMethod } = req.body;

    //Validaciones básicas
    if (!Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({
          message: "Items son requeridos y deben ser un arreglo no vacío",
        });
    }

    //Validar cantidad
    for (const items of items) {
      const { productId, quantity } = items;

      if (!productId) {
        return res.status(400).json({ message: "Producto no encontrado" });
      }

      if (!quantity || typeof quantity !== "number" || quantity < 1) {
        return res
          .status(422)
          .json({
            error: "Validación fallida",
            details: [{
              field: "items.quantity",
              message: "Cantidad debe ser un número mayor o igual a 1",
            }],
          });
      }

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(400)
        .json({ 
            error: "Producto no encontrado",
            details: [{
                "productId": productId,
                message: "El producto con el ID proporcionado no existe",
            }],
         });
      }
      if (quantity > product.stock) {
        return res.status(400).json({
          error: "Insuficiente stock para el producto ",
          details: [{
            productId: product._id,
            productName: product.name,
            available: product.stock,
            requested: quantity,
            message: `Solamente ${product.stock} disponible, requerido ${quantity}`,
          }],
        });
      }
    }
    return res.status(201).json({ message: "Venta creada exitosamente" });
  } catch (error) {
    next(error);
  }
}
