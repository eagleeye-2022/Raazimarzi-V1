const Case = require("../models/caseModel");

// Create a case
const createCase = async (req, res) => {
  try {
    const newCase = await Case.create({
      title: req.body.title,
      description: req.body.description,
      user: req.user._id  // comes from authMiddleware
    });
    res.status(201).json(newCase);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all cases for the logged-in party
const getMyCases = async (req, res) => {
  try {
    const cases = await Case.find({ user: req.user._id });
    res.status(200).json(cases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get case by ID
const mongoose = require("mongoose");

const getCaseById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid case ID" });
    }

    const caseData = await Case.findById(req.params.id);
    if (!caseData) {
      return res.status(404).json({ message: "Case not found" });
    }
    res.json(caseData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const uploadEvidence = async (req, res) => {
  try {
    const caseId = req.params.id;
    const caseData = await Case.findById(caseId);

    if (!caseData) {
      return res.status(404).json({ message: "Case not found" });
    }

    // Example: just updating evidence field
    caseData.evidence = req.body.evidence; 
    await caseData.save();

    res.json({ message: "Evidence uploaded successfully", case: caseData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = { createCase, getMyCases, getCaseById, uploadEvidence };






