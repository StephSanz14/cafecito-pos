import express from 'express';
import { getProducts, createProduct, updateProduct, deleteProduct, findProductbyID} from '../controllers/productController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import isAdmin from '../middlewares/isAdmin.js';

const router = express.Router();

router.get('/products', authMiddleware, getProducts);
router.get('/products/:id', authMiddleware, findProductbyID);
router.post('/products', authMiddleware, isAdmin, createProduct);
router.put('/products/:id', authMiddleware, isAdmin, updateProduct);
router.delete('/products/:id', authMiddleware, isAdmin,deleteProduct);

export default router;