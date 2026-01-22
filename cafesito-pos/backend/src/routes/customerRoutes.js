import express from "express";
import { getCustomers, createCustomer, getCustomerById } from "../controllers/customerController.js";

const router = express.Router();

router.get("/customers", getCustomers);
router.post("/customers", createCustomer);
router.get("/customers/:id", getCustomerById);

export default router;