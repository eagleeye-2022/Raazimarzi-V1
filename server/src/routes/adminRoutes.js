import express from "express";
import protect, { authorizeRoles } from "../middleware/authMiddleware.js";
import {
  getAllUsers, deleteUser, updateUserRole, suspendUser, activateUser, getAdminInfo,
  getCaseManagers, getMediators, getArbitrators,
  getAllCases, getCaseById,
  reviewCase, declareExParte,
  assignCaseManager, assignNeutral,
  updateCaseStatus, updateCasePriority, scheduleHearing, addTimelineNote,
  getDashboardStats,
} from "../controllers/adminController.js";
import { getAllContacts, deleteContact } from "../controllers/adminContactController.js";

const router = express.Router();
const adminOnly      = [protect, authorizeRoles(["admin"])];
const adminOrManager = [protect, authorizeRoles(["admin", "case-manager"])];

router.get("/info", getAdminInfo);
router.get("/dashboard/stats", ...adminOnly, getDashboardStats);

// Users
router.get("/users", ...adminOnly, getAllUsers);
router.patch("/users/:id/role", ...adminOnly, updateUserRole);
router.patch("/users/:id/suspend", ...adminOnly, suspendUser);
router.patch("/users/:id/activate", ...adminOnly, activateUser);
router.delete("/users/:id", ...adminOnly, deleteUser);

// Staff dropdowns
router.get("/staff/case-managers", ...adminOnly, getCaseManagers);
router.get("/staff/mediators",     ...adminOnly, getMediators);
router.get("/staff/arbitrators",   ...adminOnly, getArbitrators);

// Cases
router.get("/cases",                      ...adminOrManager, getAllCases);
router.get("/cases/:id",                  ...adminOrManager, getCaseById);
router.patch("/cases/:id/review",         ...adminOnly,      reviewCase);
router.patch("/cases/:id/ex-parte",       ...adminOnly,      declareExParte);
router.patch("/cases/:id/assign-manager", ...adminOnly,      assignCaseManager);
router.patch("/cases/:id/assign-neutral", ...adminOnly,      assignNeutral);
router.patch("/cases/:id/status",         ...adminOrManager, updateCaseStatus);
router.patch("/cases/:id/priority",       ...adminOnly,      updateCasePriority);
router.patch("/cases/:id/hearing",        ...adminOrManager, scheduleHearing);
router.post("/cases/:id/note",            ...adminOrManager, addTimelineNote);

// Contacts
router.get("/contacts",        ...adminOnly, getAllContacts);
router.delete("/contacts/:id", ...adminOnly, deleteContact);

export default router;