import express from "express";
import { requestDemo } from "../controllers/demo.controller.js";

const router = express.Router();

router.post("/demo", requestDemo);

export default router;
