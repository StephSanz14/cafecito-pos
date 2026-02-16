import mongoose from "mongoose";
import {Sale} from "../models/sale.js";
import {Product} from "../models/product.js";
import {Customer} from "../models/customer.js";

const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100; // Redondea a 2 decimales

function calculateDiscount(purchasesCount) { 
  if (!Number.isFinite(purchasesCount) || purchasesCount <= 0) return 0; // Sin descuento isFinite significa que no es NaN ni infinito
  if (purchasesCount >= 1 && purchasesCount <= 3) return 5; // 5% de descuento
  if (purchasesCount >= 4 && purchasesCount <= 7) return 10; // 10% de descuento
  return 15; // 15% de descuento
}

async function createSale(req, res, next) { 
  try {
    const { customerId, items, paymentMethod } = req.body;

    //Validamos el método de pago
    const pm = paymentMethod ?? "cash"; // Valor por defecto
    const validPaymentMethods = ["cash", "card", "transfer"]; 
    if (!validPaymentMethods.includes(pm)) {
      return res.status(422).json({
        error: "Validation failed", 
        details: [{ field: "paymentMethod", message: `paymentMethod must be one of: ${validPaymentMethods.join(", ")}` }],
      });
    }

    //Validamos items
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(422).json({
        error: "Validation failed",
        details: [{ field: "items", message: "items cannot be empty (minimum 1 item required)" }],
      });
    }

    //Validamos cliente y calculamos descuento, si no existe el cliente es 0% de descuento
    let customer = null;
    let discountPercent = 0;

    if (customerId) {
      const found = await Customer.findById(customerId);
      if (found) {
        customer = found;
        discountPercent = calculateDiscount(customer.purchasesCount ?? 0);
      }
    }

    // Procesamos los items de la venta
    const productIds = items.map((i) => i.productId); // Extraemos los IDs de productos
    const products = await Product.find({ _id: { $in: productIds } }); // Buscamos los productos en la base de datos
    const productMap = new Map(products.map((p) => [String(p._id), p])); // Map para acceso rápido por ID de producto lo que hace que busque más rápido

    let subtotal = 0;
    const saleItems = [];

    // Recorremos los items para calcular totales y validar stock
    for (const item of items) {
      const prod = productMap.get(String(item.productId));
      if (!prod) {
        return res.status(422).json({
          error: "Validation failed",
          details: [{ field: "items.productId", message: `productId ${item.productId} does not exist` }],
        });
      }
      if (item.quantity > prod.stock) {
        return res.status(400).json({
          error: "Insufficient stock",
          details: [{ productId: String(prod._id), message: `Only ${prod.stock} available, requested ${item.quantity}` }],
        }); // 400 Bad Request porque el cliente pidió más de lo que hay disponible
      }

      const unitPrice = Number(prod.price); // Aseguramos que sea número
      const lineTotal = unitPrice * item.quantity; // Total por línea

      // Preparamos el item para la venta
      saleItems.push({
        productId: prod._id,
        productNameSnapshot: prod.name,
        unitPriceSnapshot: round2(unitPrice),
        quantity: item.quantity,
        lineTotal: round2(lineTotal),
      });

      subtotal += lineTotal; // Acumulamos al subtotal
    }

    subtotal = round2(subtotal); // Redondeamos subtotal
    const discountAmount = round2(subtotal * (discountPercent / 100)); // Calculamos el monto de descuento
    const total = round2(subtotal - discountAmount); // Total final después del descuento

    // Actualizamos el stock de los productos vendidos
    for (const item of items) {
      const prod = productMap.get(String(item.productId)); // Ya sabemos que existe
      prod.stock -= item.quantity; // Reducimos el stock
      await prod.save(); // Guardamos el producto actualizado
    }

    if (customer) {
      customer.purchasesCount += 1; // Incrementamos el contador de compras del cliente
      await customer.save(); // Guardamos el cliente actualizado
    }

    // Creamos la venta en la base de datos 
    const saleObjectId = new mongoose.Types.ObjectId(); // Generamos un nuevo ObjectId para la venta 

    const sale = await Sale.create({
      _id: saleObjectId, // Usamos el ObjectId generado
      saleId: saleObjectId.toString(), // saleId como string
      customerId: customer ? customer._id : null, // Puede ser null si no hay cliente
      paymentMethod: pm, // Método de pago
      items: saleItems, //  Items de la venta
      subtotal, 
      discountPercent, // Porcentaje de descuento aplicado
      discountAmount, //  Monto de descuento
      total,
    });

    return res.status(201).json({
      saleId: sale.saleId,
      customerId: sale.customerId,
      paymentMethod: sale.paymentMethod,
      items: sale.items.map((it) => ({
        productId: String(it.productId),
        productName: it.productNameSnapshot,
        quantity: it.quantity,
        unitPrice: it.unitPriceSnapshot,
        lineTotal: it.lineTotal,
      })),
      subtotal: sale.subtotal,
      discountPercent: sale.discountPercent,
      discountAmount: sale.discountAmount,
      total: sale.total,
      ticket: {
        saleId: sale.saleId,
        timestamp: sale.createdAt.toISOString(),
        storeName: "Cafecito Feliz",
        items: sale.items.map((it) => ({
          name: it.productNameSnapshot,
          qty: it.quantity,
          unitPrice: it.unitPriceSnapshot,
          lineTotal: it.lineTotal,
        })),
        subtotal: sale.subtotal,
        discount: `${sale.discountPercent}% (-$${sale.discountAmount.toFixed(2)})`,
        total: sale.total,
        paymentMethod: sale.paymentMethod,
      },
      createdAt: sale.createdAt,
    });
  } catch (error) {
    next(error);
  }
}

async function getSaleById(req, res, next) {
  try {
    const id = (req.params.id || "").trim();
    const sale = await Sale.findOne({ saleId: id });

    if (!sale) {
      return res.status(404).json({ error: "Sale not found", id: id });
    }

    return res.status(200).json({
      saleId: sale.saleId,
      customerId: sale.customerId,
      paymentMethod: sale.paymentMethod,
      items: sale.items.map((it) => ({
        productId: String(it.productId),
        productName: it.productNameSnapshot,
        quantity: it.quantity,
        unitPrice: it.unitPriceSnapshot,
        lineTotal: it.lineTotal,
      })),
      subtotal: sale.subtotal,
      discountPercent: sale.discountPercent,
      discountAmount: sale.discountAmount,
      total: sale.total,
      ticket: {
        saleId: sale.saleId,
        timestamp: sale.createdAt.toISOString(),
        storeName: "Cafecito Feliz",
        items: sale.items.map((it) => ({
          name: it.productNameSnapshot,
          qty: it.quantity,
          unitPrice: it.unitPriceSnapshot,
          lineTotal: it.lineTotal,
        })),
        subtotal: sale.subtotal,
        discount: `${sale.discountPercent}% (-$${sale.discountAmount.toFixed(2)})`,
        total: sale.total,
        paymentMethod: sale.paymentMethod,
      },
      createdAt: sale.createdAt.toISOString(), // Formateamos la fecha a ISO 8601
    });
  } catch (error) {
    next(error);
  }
}

export { createSale, getSaleById };