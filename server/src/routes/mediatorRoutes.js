import express from "express";
import protect, { authorizeRoles } from "../middleware/authMiddleware.js";
import {
  getMyStats, getMyCases, getMyCaseById,
  resolveCase, addNote, getMyMeetings, requestHearing,
} from "../controllers/mediatorController.js";

const router = express.Router();
const isMediatorOrAdmin = [protect, authorizeRoles(["mediator", "admin"])];

router.get("/stats",                        ...isMediatorOrAdmin, getMyStats);
router.get("/cases",                        ...isMediatorOrAdmin, getMyCases);
router.get("/meetings",                     ...isMediatorOrAdmin, getMyMeetings);
router.get("/cases/:id",                    ...isMediatorOrAdmin, getMyCaseById);
router.patch("/cases/:id/resolve",          ...isMediatorOrAdmin, resolveCase);
router.post("/cases/:id/note",              ...isMediatorOrAdmin, addNote);
router.post("/cases/:id/request-hearing",   ...isMediatorOrAdmin, requestHearing);

export default router;