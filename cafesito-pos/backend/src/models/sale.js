const saleSchema = new mongoose.Schema(
  {
    saleId: {
      type: String,
      required: true,
      unique: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      default: null, // Puede ser null para ventas sin cliente registrado
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "transfer"],
      default: "cash",
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        productNameSnapshot: String, // Nombre del producto al momento de la venta (por si el nombre cambia en el futuro)
        unitPriceSnapshot: Number, // Precio unitario al momento de la venta (evita que cambios de precio afecten ventas pasadas)
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        lineTotal: Number,
      },
    ],
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    discountPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true } 
); // Agrega automáticamente createdAt y updatedAt

export const Sale = mongoose.model("Sale", saleSchema);