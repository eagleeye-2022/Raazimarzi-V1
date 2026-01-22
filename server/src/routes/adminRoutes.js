import express from "express";
import  protect, { authorizeRoles } from "../middleware/authMiddleware.js";
import { getAllUsers, deleteUser } from "../controllers/adminController.js";
import {
  getAllContacts,
  deleteContact,
} from "../controllers/adminContactController.js";

const router = express.Router();

/* USERS */
router.get("/users", protect, authorizeRoles(["admin"]), getAllUsers);
router.delete("/users/:id", protect, authorizeRoles(["admin"]), deleteUser);

/* CONTACTS */
router.get(
  "/contacts",
  protect,
  authorizeRoles(["admin"]),
  getAllContacts
);

router.delete(
  "/contacts/:id",
  protect,
  authorizeRoles(["admin"]),
  deleteContact
);

export default router;
