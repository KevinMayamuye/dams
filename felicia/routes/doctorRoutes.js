import express from "express";
import authMiddleware, { adminMiddleware } from "../middleware/authMiddleware.js";
import { listDoctors, createDoctor } from "../controllers/doctorController.js";

const router = express.Router();

router.get("/", listDoctors);
router.post("/", authMiddleware, adminMiddleware, createDoctor);

export default router;
