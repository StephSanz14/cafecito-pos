import express from "express";
import { createSale, getSaleById } from "../controllers/saleController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import isSellerorAdmin from "../middlewares/isSellerOrAdmin.js";

const router = express.Router();

router.post("/sales", authMiddleware, isSellerorAdmin, createSale);
router.get("/sales/:id", authMiddleware, isSellerorAdmin, getSaleById);

export default router; 