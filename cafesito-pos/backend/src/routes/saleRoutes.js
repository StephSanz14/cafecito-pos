import express from "express";
import { getSales, getSaleById } from "../controllers/saleController";

const router = express.Router();

router.get("/sales", getSales);
router.get("/sales/:id", getSaleById);

export default router;