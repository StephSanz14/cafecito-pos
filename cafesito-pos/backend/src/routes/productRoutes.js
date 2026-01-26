import express from 'express';
import { getProducts, createProduct, updateProduct, deleteProduct, findProductbyID} from '../controllers/productController.js';

const router = express.Router();

router.get('/products', getProducts);
router.get('/products/:id', findProductbyID);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

export default router;