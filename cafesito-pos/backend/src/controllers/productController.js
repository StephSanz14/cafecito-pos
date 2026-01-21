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

