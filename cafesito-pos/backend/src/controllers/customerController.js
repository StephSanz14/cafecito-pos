import Customer from "../models/customer.js";

async function getCustomers(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const customers = await Customer.find().skip(skip).limit(parseInt(limit));
    const totalResults = await Customer.countDocuments();
    const totalPages = Math.ceil(totalResults / limit);
    res.json({
      data: customers.map((customer) => ({
        id: customer._id,
        name: customer.name,
        phoneoremail: customer.phoneOrEmail,
        purchasesCount: customer.purchasesCount,
        createdAt: customer.createdAt,
        updatedAt: customer.updatedAt,
      })),
      pagination: {
        page,
        limit,
        totalResults,
        totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function createCustomer(req, res, next) {
  try {
    const { name, phoneOrEmail } = req.body;
    const errors = [];

    if (!name) {
      errors.push({ field: "name", message: "Name is required" });
    } else if (name.trim().length < 2 || name.trim().length > 100) {
      errors.push({
        field: "name",
        message: "Name must be between 2 and 100 characters",
      });
    }

    if (
      phoneOrEmail === undefined ||
      phoneOrEmail === null ||
      String(phoneOrEmail).trim() === ""
    ) {
      errors.push({
        field: "phoneOrEmail",
        message: "Phone or Email is required",
      });
    } else if (typeof phoneOrEmail !== "string") {
      errors.push({
        field: "phoneOrEmail",
        message: "Phone or Email must be a string",
      });
    } else {
      const value = phoneOrEmail.trim();
    }
    const isEmail = value.includes("@"); // validación básica para decidir camino
    const isIntlPhone = /^\+[0-9]{10,15}$/.test(value); // + y solo dígitos

    if (isEmail) {
      // validación básica de email (suficiente para MVP)
      const looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

      if (!looksLikeEmail) {
        errors.push({ field: "phoneOrEmail", message: "Email is not valid" });
      } else if (value.length < 5 || value.length > 100) {
        errors.push({
          field: "phoneOrEmail",
          message: "Email must be between 5 and 100 characters",
        });
      }
    } else {
      // no parece email → debe ser teléfono internacional
      if (!isIntlPhone) {
        errors.push({
          field: "phoneOrEmail",
          message:
            "Phone must start with + and contain only digits (10 to 15 numbers)",
        });
      }
    }
    if (errors.length > 0) {
      return res.status(422).json({
        error: "Validation failed",
        details: errors,
      });
    }
  } catch (error) {
    next(error);
  }
}

async function getCustomerById(req, res, next) {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    } else {
      res.json({
        id: customer._id,
        name: customer.name,
        phoneOrEmail: customer.phoneOrEmail,
        purchasesCount: customer.purchasesCount,
        createdAt: customer.createdAt,
        updatedAt: customer.updatedAt,
      });
    } }catch (error) {
    next(error);
    }
}

export { getCustomers, createCustomer, getCustomerById };