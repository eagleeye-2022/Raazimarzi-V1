import Demo from "../models/Demo.model.js";
import { sendDemoMail } from "../services/mail.service.js";

export const requestDemo = async (req, res) => {
  try {
    const { name, email, phone, company, message } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and Email are required",
      });
    }

    // Save to DB
    const demo = await Demo.create({
      name,
      email,
      phone,
      company,
      message,
    });

    // Send email
    await sendDemoMail({ name, email, phone, company, message });

    res.status(201).json({
      success: true,
      message: "Demo request submitted successfully",
      data: demo,
    });
  } catch (error) {
    console.error("Demo Request Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
