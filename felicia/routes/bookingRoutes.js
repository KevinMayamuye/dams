import express from "express";
import authMiddleware, { adminMiddleware } from "../middleware/authMiddleware.js";
import {
  getAvailableSlots,
  createBooking,
  listBookings,
  updateBooking,
} from "../controllers/bookingController.js";

const router = express.Router();

router.get("/available-slots", getAvailableSlots);
router.get("/", authMiddleware, listBookings);
router.post("/", authMiddleware, createBooking);
router.patch("/:id", authMiddleware, adminMiddleware, updateBooking);

export default router;
