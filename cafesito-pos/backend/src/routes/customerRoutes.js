import express from "express";
import { getCustomers, createCustomer, getCustomerById } from "../controllers/customerController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = express.Router();

router.get("/customers", authMiddleware,getCustomers);
router.post("/customers", authMiddleware, createCustomer);
router.get("/customers/:id", authMiddleware, getCustomerById); 

export default router;