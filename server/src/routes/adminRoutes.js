import express from "express";
import protect, { authorizeRoles } from "../middleware/authMiddleware.js";

import {
  /* users */
  getAllUsers,
  deleteUser,
  updateUserRole,
  getAdminInfo,

  /* staff dropdowns */
  getCaseManagers,
  getMediators,

  /* cases */
  getAllCases,
  getCaseById,
  assignCaseManager,
  assignMediator,
  updateCaseStatus,
  scheduleHearing,
  updateCasePriority,
  addTimelineNote,

  /* dashboard */
  getDashboardStats,
} from "../controllers/adminController.js";

import {
  getAllContacts,
  deleteContact,
} from "../controllers/adminContactController.js";

const router = express.Router();

// Shorthand middleware stacks
const adminOnly = [protect, authorizeRoles(["admin"])];
const adminOrManager = [protect, authorizeRoles(["admin", "case-manager"])];

/* ─── Admin Info ─── */
router.get("/info", getAdminInfo);

/* ─── Dashboard Stats ─── */
router.get("/dashboard/stats", ...adminOnly, getDashboardStats);

/* ─── Users ─── */
router.get("/users", ...adminOnly, getAllUsers);
router.patch("/users/:id/role", ...adminOnly, updateUserRole);
router.delete("/users/:id", ...adminOnly, deleteUser);

/* ─── Staff Dropdowns ─── */
router.get("/staff/case-managers", ...adminOnly, getCaseManagers);
router.get("/staff/mediators", ...adminOnly, getMediators);

/* ─── Cases ─── */
router.get("/cases", ...adminOrManager, getAllCases);
router.get("/cases/:id", ...adminOrManager, getCaseById);
router.patch("/cases/:id/assign-manager", ...adminOnly, assignCaseManager);
router.patch("/cases/:id/assign-mediator", ...adminOrManager, assignMediator);
router.patch("/cases/:id/status", ...adminOrManager, updateCaseStatus);
router.patch("/cases/:id/priority", ...adminOnly, updateCasePriority);
router.patch("/cases/:id/hearing", ...adminOrManager, scheduleHearing);
router.post("/cases/:id/note", ...adminOrManager, addTimelineNote);

/* ─── Contacts ─── */
router.get("/contacts", ...adminOnly, getAllContacts);
router.delete("/contacts/:id", ...adminOnly, deleteContact);

export default router;