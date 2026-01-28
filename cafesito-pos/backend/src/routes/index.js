import express from 'express';
import customerRoutes from './customerRoutes.js';
import saleRoutes from './saleRoutes.js';
import productRoutes from './productRoutes.js';

const router = express.Router();

router.use('/customer', customerRoutes);
router.use('/sale', saleRoutes);
router.use('/product', productRoutes);  

export default router;