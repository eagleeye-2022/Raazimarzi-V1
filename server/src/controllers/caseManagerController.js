const Case = require("../models/caseModel");

// Get all cases
const getAllCases = async (req, res) => {
  try {
    const cases = await Case.find().populate("mediator", "name email");
    res.json(cases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Assign mediator
const assignMediator = async (req, res) => {
  try {
    const caseData = await Case.findById(req.params.id);
    if (!caseData) return res.status(404).json({ message: "Case not found" });

    caseData.mediator = req.body.mediatorId;
    await caseData.save();

    res.json({ message: "Mediator assigned", case: caseData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllCases, assignMediator };

