import express from "express";
import { getSales, getSaleById } from "../controllers/saleController";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/sales", authMiddleware, getSales);
router.get("/sales/:id", authMiddleware, getSaleById);

export default router;