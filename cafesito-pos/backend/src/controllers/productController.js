import {Product} from "../models/product.js";

async function getProducts(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const q = req.query.q || "";

    //validar que page sea 1 o mayor
    if (page < 1) { 
      return res.status(400).json({
        error: "Invalid query parameter",
        details: [{ field: "page", message: "page must be a number >= 1" }],
      });
    }

    if (limit < 1 || limit > 100) {
      return res.status(400).json({
        error: "Invalid query parameter",
        details: [
          {
            field: "limit",
            message: "limit must be a number between 1 and 100",
          },
        ],
      });
    }

    const skip = (page - 1) * limit;

    //creamos el filtro de búsqueda
    const filter = {};
    if (q && q.trim() !== "") {
      filter.name = { $regex: q.trim(), $options: "i" };
    }

    const products = await Product.find(filter).skip(skip).limit(limit);
    const total = await Product.countDocuments(filter);

    //busco algo que no existe respuesta con 200 y array vacío
    return res.status(200).json({
      data: products.map((p) => ({
        id: p._id,
        name: p.name,
        price: p.price,
        stock: p.stock,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      })),
      total,
      page,
      limit,
      ...(q !== "" && total === 0
        ? { message: `No products found matching '${q}'` }
        : {}),
    });
  } catch (error) {
    next(error);
  }
}

async function createProduct(req, res, next) {
  try {
    const { name, price, stock } = req.body;
    const errors = [];

    if (!name) {
      errors.push({
        field: "name",
        message: "Name is required",
      }); 
    }

    if (price === undefined || typeof price !== "number" || price <= 0) {
      errors.push({
            field: "price",
            message: "price must be a number greater than 0",
      });
    }

    if (stock === undefined || typeof stock !== "number" || stock < 1) {
      errors.push({
        field: "stock",
        message: "stock must be a number greater than or equal to 1",
      });
    }

    if (errors.length === 0) {
      const newProduct = new Product({ name, price, stock });
      const savedProduct = await newProduct.save();
      return res.status(201).json(savedProduct);
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

async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;
    const { name, price, stock } = req.body;
    const errors = [];

    if (name === undefined && price === undefined && stock === undefined) {
      return res.status(400).json({
        error:
          "At least one field (name, price, stock) must be provided for update",
      });
    }
    if (name !== undefined) {
      if (typeof name !== "string" || name.length < 2 || name.length > 100) {
        errors.push({
          field: "name",
          message: "Name must be a string between 2 and 100 characters",
        });
      }
    }
    if (price !== undefined) {
      if (typeof price !== "number" || price <= 0) {
        errors.push({
          field: "price",
          message: "Price must be a number greater than 0",
        });
      }
    }
    if (stock !== undefined) {
      if (typeof stock !== "number" || stock < 0) {
        errors.push({
          field: "stock",
          message: "Stock must be a number greater than or equal to 0",
        });
      }
    }

    if (errors.length > 0) {
      return res.status(422).json({
        error: "Validation failed",
        details: errors,
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, price, stock },
      { new: true, runValidators: true },
    );
    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found", id: id });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
}

//Encontrar producto por ID

async function findProductbyID(req, res, next) {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found", id: id });
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        error: "Product not found",
        id,
      });
    }

    return res.status(200).json({
      message: "Product deleted successfully",
      id,
    });
  } catch (error) {
    next(error);
  }
}

export {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  findProductbyID,
};