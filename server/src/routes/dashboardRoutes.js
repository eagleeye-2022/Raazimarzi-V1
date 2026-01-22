import express from "express";
const router = express.Router();

// Example endpoint for user dashboard data
router.get("/user", (req, res) => {
  try {
    res.json({
      stats: { active: 4, current: 2, total: 6 },
      cases: [
        {
          id: "#3201",
          title: "Property Dispute",
          party1: "Mohan Das",
          party2: "Ravi Gupta",
          category: "Property Dispute",
          mediator: "Ajay Sharma",
          status: "Active",
        },
        {
          id: "#3202",
          title: "Divorce Settlement",
          party1: "Amit Kumar",
          party2: "Neha Sharma",
          category: "Family Dispute",
          mediator: "Sunita Reddy",
          status: "Active",
        },
      ],
      meetings: [
        {
          id: 1,
          date: "2025-11-06",
          time: "10:00 AM - 12:00 PM",
          title: "Property Dispute #3201",
        },
        {
          id: 2,
          date: "2025-11-08",
          time: "03:00 PM - 04:30 PM",
          title: "Divorce Settlement #3202",
        },
      ],
    });
  } catch (error) {
    console.error("Error in /dashboard/user:", error);
    res.status(500).json({ message: "Server error loading dashboard" });
  }
});

export default router;
