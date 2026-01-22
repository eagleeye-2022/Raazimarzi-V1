import express from "express";
import  protect  from "../middleware/authMiddleware.js";
import { getMediatorProfile } from "../controllers/mediatorController.js";

const router = express.Router();

// Protected route example
router.get("/profile", protect, getMediatorProfile);

export default router;
