import Product from "../models/product.js";

async function getProducts(req,res){
    try{
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt (req.query.limit) || 20;
        const skip = (page-1)*limit;

        const products = await Product.find()
        .skip(skip)
        .limit(limit); 

        const totalResults = await Product.countDocuments();
        const totalPages = Math.ceil(totalResults / limit);

        res.json({
           data: products.map(product => ({
            id: product._id,
            name: product.name,
            price: product.price,
            stock: product.stock,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
           })),
           currentPage: page,
           totalResults,
           totalPages,
           limit,
        });
    } catch (error) {
        next (error);
    }
}

async function createProduct (req,res,next){
    try{
        const {name, price, stock} = req.body;
        const errors = [];

        if (!name) {
            errors
            .push ({ 
                error: "Validation failed",
                details: [{
                field: "name", message: "Name is required" }],
            });
        }

        if (price === undefined || typeof price !== "number" || price <= 0) {
        errors.push({
        error: "Validation failed",
        details: [{   
        field: "price",
        message: "price must be a number greater than 0",
        }],
        });
    }

    if (stock === undefined || typeof stock !== "number" || stock < 0) {
        errors.push({
        field: "stock",
        message: "stock must be a number greater than or equal to 0",
        });
    }

    if (errors.length > 0) {
      return res.status(422).json({
        error: "Validation failed",
        details: errors,
      });
    }
        
    } catch (error) {
        next (error);
    }
}

async function updateProduct (req,res,next){
    try{
        const {id} = req.params;
        const {name, price, stock} = req.body;
        const errors = [];

        if (name=== undefined && price === undefined && stock === undefined) {
            return res.status(400).json({
                error: "At least one field (name, price, stock) must be provided for update",
            } );
        }
        if (name !== undefined) {
            if (typeof name !== "string" || name.length < 2 || name.length > 100) {
                errors.push({ field: "name", message: "Name must be a string between 2 and 100 characters" });
            }
        }
        if (price !== undefined) {
            if (typeof price !== "number" || price <= 0) {
                errors.push({ field: "price", message: "Price must be a number greater than 0" });
            }
        }
        if (stock !== undefined) {
            if (typeof stock !== "number" || stock < 0) {
                errors.push({ field: "stock", message: "Stock must be a number greater than or equal to 0" });
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
            {name, price, stock},
            {new: true , runValidators: true}
        );
        if (!updatedProduct) {
            return res.status(404).json({ error: "Product not found", id: id });
        } res.status(200).json(updatedProduct);
    } catch (error) {
        next (error);
    }

}

async function deleteProduct(req, res, next) {
  try {
    const id = req.params.id;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
};
 