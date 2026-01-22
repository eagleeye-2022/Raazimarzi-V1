import Case from "../models/caseModel.js";
import Meeting from "../models/meetingModel.js";

export const getUserDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;

    const cases = await Case.find({ userId });
    const meetings = await Meeting.find({ userId });

    const stats = {
      active: cases.filter(c => c.status === "Active").length,
      total: cases.length,
      current: cases.filter(c => c.status === "Ongoing").length,
    };

    res.json({ stats, cases, meetings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
