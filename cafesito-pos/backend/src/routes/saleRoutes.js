import express from "express";
import { createSale, getSaleById } from "../controllers/saleController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/sales", authMiddleware, createSale);
router.get("/sales/:id", authMiddleware, getSaleById);

export default router;