// import express from "express";
// import { signup, sendOtp, verifyOtp } from "../controllers/authController.js";

// const router = express.Router();


// router.post("/signup", signup);
// router.post("/", sendOtp);
// router.post("/verify", verifyOtp);

// export default router;

import express from "express";
import { resetPassword } from "../controllers/authController.js";

const router = express.Router();

router.post("/reset-password", resetPassword);

export default router;