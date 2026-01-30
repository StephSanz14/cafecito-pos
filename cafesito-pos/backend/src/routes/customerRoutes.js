import express from "express";
import { getCustomers, createCustomer, getCustomerById } from "../controllers/customerController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import isSellerorAdmin from "../middlewares/isSellerOrAdmin.js";

const router = express.Router();

router.get("/customers", authMiddleware, isSellerorAdmin, getCustomers);
router.post("/customers", authMiddleware, isSellerorAdmin, createCustomer);
router.get("/customers/:id", authMiddleware, isSellerorAdmin, getCustomerById); 

export default router;