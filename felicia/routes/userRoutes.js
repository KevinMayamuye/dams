import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getProfile } from "../controllers/userController.js";

const router = express.Router();

router.get("/profile", authMiddleware, async (req, res) => {
    res.json(req.user);
});

export default router;
