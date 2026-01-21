const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 100,
    },
    phoneOrEmail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    purchasesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

export const Customer = mongoose.model("Customer", customerSchema);