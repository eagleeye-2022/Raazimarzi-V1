const express = require("express");
const { getAllCases, assignMediator } = require("../controllers/caseManagerController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/test", (req, res) => res.json({ message: "Case Manager routes working ✅" }));

router.get("/cases", protect, getAllCases);
router.put("/cases/:id/assign", protect, assignMediator);

module.exports = router;
